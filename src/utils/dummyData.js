import * as d3 from "d3"

const randomAroundMean = (mean, deviation) => mean + boxMullerRandom() * deviation
const randomNumber = (min, max) => Math.floor(Math.random() * max) + min
const randomCategory = () => {
  const categories = [
    "Category A",
    "Category B",
    "Category C",
    "Category D",
    "Category E",
  ]
  return categories[Math.floor(Math.random() * categories.length)]
}

const boxMullerRandom = () => (
  Math.sqrt(-2.0 * Math.log(Math.random())) *
  Math.cos(2.0 * Math.PI * Math.random())
)

const today = new Date()
const formatDate = d3.timeFormat("%m/%d/%Y")
export const getTimelineData = (length = 100) => {
  let lastTemperature = randomAroundMean(70, 20)
  const firstTemperature = d3.timeDay.offset(today, -length)

  return new Array(length).fill(0).map((d, i) => {
    lastTemperature += randomAroundMean(0, 2)
    return {
      date: formatDate(d3.timeDay.offset(firstTemperature, i)),
      temperature: lastTemperature,
    }
  })
}

export const getScatterData = (count = 100) => (
  new Array(count).fill(0).map((d, i) => ({
    temperature: randomAroundMean(70, 20),
    humidity: randomAroundMean(0.5, 0.1),
  }))
)

export const getRandomData = (length = 100) => {
  return new Array(length).fill(0).map((d, i) => {
    return {
      category: randomCategory(),
      number: randomNumber(0, 100),
    }
  })
}