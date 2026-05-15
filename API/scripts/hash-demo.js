import 'dotenv/config'
import { hashText } from '../utils/hash.js'

const originalText = 'HolaMundo123'
const sameText = 'HolaMundo123'
const changedText = 'HolaMundo124'

const originalHash = hashText(originalText)
const sameHash = hashText(sameText)
const changedHash = hashText(changedText)

console.log('Texto original:', originalText)
console.log('Hash original:', originalHash)
console.log('Mismo texto:', sameText)
console.log('Hash del mismo texto:', sameHash)
console.log('Coinciden:', originalHash === sameHash)
console.log('Texto modificado:', changedText)
console.log('Hash del texto modificado:', changedHash)
console.log('Cambia el hash:', originalHash !== changedHash)
