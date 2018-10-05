document.addEventListener("DOMContentLoaded", init)

function init(e){
  getBurgers()
    .then(handleBurgers)

  const burgerList = document.querySelector(".BurgerList")
  const burgerDisplay = document.querySelector(".BurgerDisplay")
  const burgerFilter = document.querySelector("#burger-filter")

  burgerList.addEventListener("click", handleBurgerClick)
  burgerFilter.addEventListener("change", handleFilterChange)
  burgerDisplay.addEventListener("change", handleChangeBurgerCategory)

  let ignoredIds = []

  function getBurgers(){
    return fetch("http://localhost:3001/burgers")
      .then(res => res.json())
  }

  function handleBurgers(burgers){
    burgerList.innerHTML = ""
    if (burgerFilter.value === "All"){
      burgers.filter(b => !ignoredIds.includes(b.id)).forEach(addBurgerToBurgerlist)
    } else {
      burgers.filter(b => b.category === burgerFilter.value && !ignoredIds.includes(b.id)).forEach(addBurgerToBurgerlist)
    }
  }

  function addBurgerToBurgerlist(burger){
    burgerList.innerHTML += `
    <div>
      <div class="BurgerItem">
        ${burger.name}
      </div>
      <div class="BurgerBottomBun">
        <button data-burger=${burger.id}>Show</button>
        <button data-burger=${burger.id}>Delete</button>
      </div>
    </div>
    `
  }

  function handleBurgerClick(e) {
    if (e.target.type === "submit") {
      if (e.target.innerText === "Show"){
        const burgerId = e.target.dataset.burger
        getSingleBurger(burgerId)
          .then(displayBurger)
      } else if (e.target.innerText === "Delete") {
        ignoredIds = [...ignoredIds, parseInt(e.target.dataset.burger, 10)]
        getBurgers()
          .then(handleBurgers)
      }
    }
  }

  function getSingleBurger(burgerId){
    return fetch(`http://localhost:3001/burgers/${burgerId}`)
      .then(res => res.json())
  }

  function displayBurger(burger){
    burgerDisplay.innerHTML = `
    <div class="BurgerDisplay">
      <img src=${burger.imgURL}>
      <br>
      <h1>${burger.name}</h1>
      <br>
      <select id="select-category" data-burger=${burger.id}>
        <option value="Relatable" ${burger.category === "Relatable" && "selected"}>Relatable</option>
        <option value="Bougie" ${burger.category === "Bougie" && "selected"}>Bougie</option>
      </select>
    </div>
    `
  }

  function handleFilterChange(e){
    getBurgers()
      .then(handleBurgers)
  }

  function handleChangeBurgerCategory(e){
    updateBurgerCategory(e.target.value, e.target.dataset.burger)
      .then(() => {
        getBurgers()
        .then(handleBurgers)
      })
  }

  function updateBurgerCategory(newCategory, burgerId){
    const options = {
      headers: {
        "content-type":"application/json"
      },
      method: "PATCH",
      body: JSON.stringify({
        category: newCategory,
      })
    }
    return fetch(`http://localhost:3001/burgers/${burgerId}`, options)
      .then(res => res.json())
  }


}
