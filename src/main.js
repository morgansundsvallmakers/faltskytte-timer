import './style.css'

const shootingTimeInput = document.querySelector('#shooting-time')
const startButton = document.querySelector('.start-button')
const status = document.querySelector('.status')
let sequenceAudio = null
let sequenceUrl = null

function validateShootingTime() {
  const shootingTime = Number(shootingTimeInput.value)
  const valid = Number.isInteger(shootingTime) && shootingTime >= 1 && shootingTime <= 300

  startButton.disabled = !valid
  status.textContent = valid
    ? `Klar att starta med ${shootingTime} sekunders skjuttid.`
    : 'Ange en skjuttid mellan 1 och 300 sekunder.'

  return valid
}

async function loadWav(path) {
  const response = await fetch(`${import.meta.env.BASE_URL}audio/commands/${path}`)
  if (!response.ok) throw new Error(`Kunde inte hämta ${path}`)

  const buffer = await response.arrayBuffer()
  const view = new DataView(buffer)

  if (view.getUint32(0, false) !== 0x52494646 || view.getUint32(8, false) !== 0x57415645) {
    throw new Error(`${path} är inte en WAV-fil`)
  }

  let offset = 12
  let format = null
  let samples = null

  while (offset + 8 <= view.byteLength) {
    const chunkId = view.getUint32(offset, false)
    const chunkSize = view.getUint32(offset + 4, true)
    const chunkStart = offset + 8

    if (chunkId === 0x666d7420) {
      format = {
        audioFormat: view.getUint16(chunkStart, true),
        channels: view.getUint16(chunkStart + 2, true),
        sampleRate: view.getUint32(chunkStart + 4, true),
        bitsPerSample: view.getUint16(chunkStart + 14, true)
      }
    } else if (chunkId === 0x64617461) {
      samples = new Int16Array(buffer.slice(chunkStart, chunkStart + chunkSize))
    }

    offset = chunkStart + chunkSize + (chunkSize % 2)
  }

  if (!format || !samples) throw new Error(`Ofullständig WAV-fil: ${path}`)
  if (format.audioFormat !== 1 || format.channels !== 1 || format.bitsPerSample !== 16) {
    throw new Error(`${path} måste vara mono PCM 16-bit`)
  }

  return { ...format, samples }
}

function writeWav(samples, sampleRate) {
  const buffer = new ArrayBuffer(44 + samples.length * 2)
  const view = new DataView(buffer)

  const writeText = (offset, text) => {
    for (let i = 0; i < text.length; i += 1) view.setUint8(offset + i, text.charCodeAt(i))
  }

  writeText(0, 'RIFF')
  view.setUint32(4, 36 + samples.length * 2, true)
  writeText(8, 'WAVE')
  writeText(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, 1, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * 2, true)
  view.setUint16(32, 2, true)
  view.setUint16(34, 16, true)
  writeText(36, 'data')
  view.setUint32(40, samples.length * 2, true)

  new Int16Array(buffer, 44).set(samples)
  return new Blob([buffer], { type: 'audio/wav' })
}

async function buildTestSequence() {
  const commands = await Promise.all([
    loadWav('tio-sekunder-kvar.wav'),
    loadWav('fardiga.wav'),
    loadWav('eld.wav')
  ])

  const sampleRate = commands[0].sampleRate
  if (!commands.every((command) => command.sampleRate === sampleRate)) {
    throw new Error('Kommandofilerna har olika samplingsfrekvens')
  }

  const starts = [0, 7 * sampleRate, 10 * sampleRate]
  const totalSamples = Math.max(...commands.map((command, index) => starts[index] + command.samples.length))
  const sequence = new Int16Array(totalSamples)

  commands.forEach((command, index) => {
    sequence.set(command.samples, starts[index])
  })

  return writeWav(sequence, sampleRate)
}

shootingTimeInput.addEventListener('input', validateShootingTime)

startButton.addEventListener('click', async () => {
  if (!validateShootingTime()) return

  startButton.disabled = true
  status.textContent = 'Bygger testsekvens...'

  try {
    const wav = await buildTestSequence()

    if (sequenceAudio) sequenceAudio.pause()
    if (sequenceUrl) URL.revokeObjectURL(sequenceUrl)

    sequenceUrl = URL.createObjectURL(wav)
    sequenceAudio = new Audio(sequenceUrl)
    sequenceAudio.addEventListener('ended', () => {
      startButton.disabled = false
      status.textContent = 'Ljudtest klart.'
    })

    status.textContent = 'Spelar test: 10 sekunder kvar → Färdiga → Eld.'
    await sequenceAudio.play()
  } catch (error) {
    console.error('Kunde inte bygga eller spela testsekvensen.', error)
    startButton.disabled = false
    status.textContent = 'Kunde inte bygga eller spela testsekvensen.'
  }
})

validateShootingTime()
