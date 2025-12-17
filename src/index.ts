import fs from 'fs/promises' 

type Key = string
type Model = Map<Key, string[]>

function train(text: string, n: number): Model {

    const words = text.trim().split(/\s+/)
    const model: Model = new Map()
    for (let i =0; i< words.length - n; i++) {
        const key = words.slice(i, i+n).join(" ")
        const value = words[i + n]
        let modelValues = model.get(key)
        if (!modelValues) {
            modelValues = []
            model.set(key, modelValues)
        }
        modelValues.push(value!)
        model.set(key, modelValues)
    }

    return model
}

const randomIndex = (scalar: number): number => Math.floor(Math.random() * scalar) 
function getRandomKey(map: Model): Key {
    const keys = Array.from(map.keys())
    const idx = randomIndex(keys.length)
    return keys[idx]!
}
function getRandomValue<T>(arr: T[]): T {
    const idx = randomIndex(arr.length)
    return arr[idx]!
    
}

function generate(model: Model, length: number, prompt?: Key): string {
    let key = prompt ? prompt : getRandomKey(model) 
    const output = key.split(" ")
    for (let _ = 0; _ < length - key.split(' ').length; _ ++ ) {
        const values = model.get(key)
        if (!values) break
        // random choice of work from values
        const nextWord = getRandomValue(values)
        // add that word to output
        output.push(nextWord)
        // set new key
        key = key.split(" ").slice(1).concat(nextWord).join(" ")
    }
    return output.join(" ")
}

async function readTextFile(filePath: string): Promise<string> {
    const data = await fs.readFile(filePath, 'utf8')
    return data
}
const file = process.argv[2]
const prompt = process.argv[3]

if (!file) {
    throw new Error(`No file found for ${file}`)
}
const data = await readTextFile(file)
const model = train(data, 2)

const output = generate(model,140)
console.log(output)
