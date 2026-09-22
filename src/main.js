import './style.css'

const shootingTimeInput = document.querySelector('#shooting-time')
const startButton = document.querySelector('.start-button')
const status = document.querySelector('.status')

function validateShootingTime() {
  const shootingTime = Number(shootingTimeInput.value)
  const valid = Number.isInteger(shootingTime) && shootingTime >= 1 && shootingTime <= 300

  startButton.disabled = !valid
  status.textContent = valid
    ? `Klar att starta med ${shootingTime} sekunders skjuttid.`
    : 'Ange en skjuttid mellan 1 och 300 sekunder.'

  return valid
}

shootingTimeInput.addEventListener('input', validateShootingTime)

startButton.addEventListener('click', () => {
  if (!validateShootingTime()) return

  const shootingTime = Number(shootingTimeInput.value)
  status.textContent = `Start registrerad. Skjuttid: ${shootingTime} sekunder.`
})

validateShootingTime()
