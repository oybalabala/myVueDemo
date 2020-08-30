function a () {
  let name = 'oy'
  return () => {
    return name
  }
}
let b = a()
console.log(b())
