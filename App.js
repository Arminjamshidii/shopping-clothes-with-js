import { productsData } from "./Products.js";

const popularProducts = document.querySelector(".popular-products")
const cartModal = document.querySelector(".cart-center");
const backdrop = document.querySelector(".backdrop")
const closeModal = document.querySelector(".cart-item-close")
const cartBtn = document.querySelector(".cart-btn")
const cartTotal = document.querySelector(".cart-totoal")
const cartItems = document.querySelector(".count")
const cartContent = document.querySelector(".cart-content")
const clearCart = document.querySelector(".clear-cart")
let buttonDom = []





let cart = []
let favorit = []

function showModalfunction() {
    backdrop.style.display = "block";
    cartModal.style.visibility = "visible";

}
function closeModalfunction() {
    backdrop.style.display = "none";
    cartModal.style.visibility = "hidden";
    // cartModal.style.opacity=0;

}
cartBtn.addEventListener("click", showModalfunction)
closeModal.addEventListener("click", closeModalfunction)
backdrop.addEventListener("click", closeModalfunction)



// console.log(popularProducts);
class Products {
    getProducts() {
        return productsData
    }
}

class Ui {
    displayProducts(products) {
        let cards = ""


        products.forEach(item => {
            // console.log(item);
            cards += `
            <article>
                <div class="image-article"><img src=${item.img} alt="clothes"></div>
                <h2>${item.title}</h2>
               <section>
                <p>${item.price}$</p>
                <label class="ui-like">
    <input type="checkbox">
    <div class="like"  >
      <svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill=""><g stroke-width="0" id="SVGRepo_bgCarrier"></g><g stroke-linejoin="round" stroke-linecap="round" id="SVGRepo_tracerCarrier"></g><g id="SVGRepo_iconCarrier"><path class="like-btn"data-id=${item.id} d="M20.808,11.079C19.829,16.132,12,20.5,12,20.5s-7.829-4.368-8.808-9.421C2.227,6.1,5.066,3.5,8,3.5a4.444,4.444,0,0,1,4,2,4.444,4.444,0,0,1,4-2C18.934,3.5,21.773,6.1,20.808,11.079Z"></path></g></svg>
       </div>
  </label>
  </section>
      
                <button class="add-to-cart" data-id=${item.id}>Add to cart<img src="./image/icons/shoping card white.svg" alt="icon"></button> 
            </article>`
            popularProducts.innerHTML = cards
        })
    }

    getAddToFavorit() {
        const addToFavorit = document.querySelectorAll(".like-btn")
        const like = [...addToFavorit];
        like.forEach(item => {
            const idLike = item.dataset.id;
            // console.log(idLike); 
            const isInFavorit = favorit.find(item => item.id == item);
            if (isInFavorit) {

                item.disabled = true

            }
            item.addEventListener("click", (e) => {
                const addedFavorit = { ...storage.getProduct(idLike), quantity: 1 };
                favorit = [...favorit, addedFavorit]
                storage.saveFavorit(favorit)
                console.log(e.target.dataset.id);
            })

        })

    }

    getAddToCartBtns() {
        const addToCartBtns = [...document.querySelectorAll(".add-to-cart")];
        buttonDom = addToCartBtns
        // const buttons = [...addToCartBtns];
        addToCartBtns.forEach(btn => {
            const id = btn.dataset.id;
            // console.log(id);
            const isInCart = cart.find(p => p.id == id);
            if (isInCart) {
                btn.innerText = "in cart";
                btn.disabled = true

            }
            btn.addEventListener("click", (e) => {
                const addedProduct = { ...storage.getProduct(id), quantity: 1 };
                e.target.innerText = "in cart"
                e.target.disabled=true
                cart = [...cart, addedProduct]
                storage.saveCart(cart)
                // console.log(e.target.dataset.id);
                this.setCartValue(cart);
                this.addCartItem(addedProduct)
            })

        })

    }

    setCartValue(cart) {
        let tempcartItems = 0;
        const totalPrice = cart.reduce((acc, curr) => {
            tempcartItems += curr.quantity
            return acc + curr.quantity * curr.price
        }, 0)

        cartTotal.innerText = `total price :${totalPrice.toFixed(2)}$`;
        cartItems.innerText = tempcartItems
    }
    addCartItem(cartItem) {
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
      
        <img class="cart-item-img" src=${cartItem.img} alt="order">
        <div class="cart-item-discription">
            <h4>${cartItem.title}</h4>
            <h5>${cartItem.price}$</h5>
        </div>
        
        <div  class="cart-item-controller">
            <i data-id=${cartItem.id} class="fa-solid fa-chevron-up chevron-up"></i>
            <p>${cartItem.quantity}</p>
            <i data-id=${cartItem.id} class="fa-solid fa-chevron-down chevron-down"></i>
            </div>
            <i data-id=${cartItem.id} class="fa-regular fa-trash-can trash" style="color: #f34f4f;"></i>
    <!-- <i class="fa-regular fa-trash-can" style="color: #0d0d0d;"></i>-->
       </div>
       
       `;
        cartContent.appendChild(div)

    }

    setupApp() {
        cart = storage.getCart() || []
        // console.log(cart);
        cart.forEach(cartItem => this.addCartItem(cartItem))
        this.setCartValue(cart)
    }
    cartLogic() {
        clearCart.addEventListener("click", () => {
            this.clearCart()

        })
        cartContent.addEventListener("click", (e) => {
            // console.log(e.target);
            if (e.target.classList.contains("chevron-up")) {
                const addQuantity = e.target;
                const addedItem = cart.find(cartitem => cartitem.id == addQuantity.dataset.id);
                addedItem.quantity++;
                this.setCartValue(cart);
                storage.saveCart(cart);
                addQuantity.nextElementSibling.innerText = addedItem.quantity;


            } else if (e.target.classList.contains("fa-trash-can")) {
                const removeItem = e.target
                const removedItem = cart.find(cItem => cItem.id == removeItem.dataset.id)
                // console.log(removeItem.id);
                this.removeItem(removedItem.id);
                storage.saveCart(cart);
                // console.log(cartContent);
                cartContent.removeChild(removeItem.parentElement)

            } else if (e.target.classList.contains("chevron-down")) {
                const subQuantity = e.target;
                const subtractedItem = cart.find(c => c.id == subQuantity.dataset.id);
                if (subtractedItem.quantity==1) {
                    this.removeItem(subtractedItem.id);
                    cartContent.removeChild(subQuantity.parentElement.parentElement)
                }
                subtractedItem.quantity--;
                this.setCartValue(cart);
                storage.saveCart(cart);
                subQuantity.previousElementSibling.innerText = subtractedItem.quantity;
                // return;

            }

        })
    }

    clearCart() {
        cart.forEach(cartItem => this.removeItem(cartItem.id))
        while (cartContent.children.length) {
            cartContent.removeChild(cartContent.children[0])

        }
        closeModalfunction()

    }
    removeItem(id) {
        cart = cart.filter(cartitem => cartitem.id != id);
        this.setCartValue(cart);
        storage.saveCart(cart);
        this.getSingleButton(id);


    }

    getSingleButton(id) {
        const button = buttonDom.find(btn => btn.dataset.id == parseInt(id))
        button.innerHTML = `Add to cart <img src="./image/icons/shoping card white.svg" alt="icon">`
        button.disabled = false
    }
}










class storage {
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products))
    }
    static getProduct(id) {
        const myproducts = JSON.parse(localStorage.getItem("products"));
        return myproducts.find(p => p.id == parseInt(id))
    }
    static getFavoritProduct(id) {
        const myFavoritProduct = JSON.parse(localStorage.getItem("products"));
        return myFavoritProduct.find(item => item.id == parseInt(id))
    }
    static saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));

    }
    static saveFavorit(favorit) {
        localStorage.setItem("favorit item", JSON.stringify(favorit));
    }
    static getCart() {
        return JSON.parse(localStorage.getItem("cart"))
    }
}



document.addEventListener("DOMContentLoaded", () => {
    const products = new Products();
    const productsData = products.getProducts();
    // console.log(productsData);
    const ui = new Ui();
    ui.setupApp()
    ui.displayProducts(productsData);
    ui.getAddToCartBtns()
    ui.getAddToFavorit()
    ui.cartLogic()
    storage.saveProducts(productsData);
}
)


//============================ timer ===========================

const targetDate = new Date("2023-12-25");
console.log(new Date().getDay());
console.log(targetDate);
targetDate.setDate(targetDate.getDate() + 7);


setInterval(updateTimer, 1000);

function updateTimer() {
  const currentDate = new Date();
  console.log(currentDate);

  const remainingTime = targetDate - currentDate;
  // console.log(remainingTime);

  // days, hours, minutes, and seconds
  const d = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
  let h = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  let m = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
  let s = Math.floor((remainingTime % (1000 * 60)) / 1000);
// hours=(hours<10)?`0${hours}`:hours
h = (h < 10) ? `0${h}` : h;
m = (m < 10) ? `0${m}` : m;
s = (s < 10) ? `0${s}` : s;
let time =`${d} : ${h} : ${m} : ${s} `

  // Display the remaining time
  let timer =document.querySelector('.timer')
//   console.log(timer);
  timer.textContent = time;


  if (remainingTime < 0) {
    clearInterval(updateTimer);
    timer.textContent = "SOLD OUT";
  }
}


//====================discript title =======================

const discriptTitle=document.querySelector('.discript-title-icon')
discriptTitle.addEventListener('click',()=>{
    document.querySelector('.discript-title').style.display="none"
}
)
