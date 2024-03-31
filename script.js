const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");

let cart = [];

cartBtn.addEventListener("click", function () {
    updateCartModal();
    cartModal.style.display = "flex";

})

cartModal.addEventListener("click", (e) => {
    if (e.target === cartModal) {
        cartModal.style.display = "none"
    }
})

closeModalBtn.addEventListener("click", () => {
    cartModal.style.display = "none";
})

menu.addEventListener("click", (e) => {
    let parentButton = e.target.closest(".add-to-cart-btn")

    if (parentButton) {
        const nome = parentButton.getAttribute("data-nome")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        addToCart(nome, price);
    }
})

function addToCart(nome, price) {
    const itemExistente = cart.find(item => item.nome === nome)

    if (itemExistente) {
        itemExistente.quantity += 1;

    } else {

        cart.push({
            nome,
            price,
            quantity: 1,
        })

    }

    updateCartModal();

}

function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div")
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium">${item.nome}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>
                
                    <button class="delete-cart-btn" data-nome="${item.nome}">
                        Remover
                    </button>
                
            </div>
            `
        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement);

    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;

}


cartItemsContainer.addEventListener("click", (e) => {
    if(e.target.classList.contains("delete-cart-btn")) {
        const nome = e.target.getAttribute("data-nome")

        removeItemCart(nome);
    }
})

function removeItemCart(nome){
    const index = cart.findIndex(item => item.nome === nome);

    if(index !== -1){
        const item = cart[index];

        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}

addressInput.addEventListener("input", (e) => {
    let inputValue = e.target.value;

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})

checkoutBtn.addEventListener("click", () => {

    const isOpen = checkRestaurantOpen();
    if(!isOpen){
        
        Toastify({
            text: "Ops, a loja encontra-se fechada no momento!",
            duration: 3000,           
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
            background: "linear-gradient(to right, #FF0000, #FF5555, #FF0000)",
            },            
        }).showToast();

        cartItemsContainer.innerHTML = "";
        cartTotal.innerHTML = "0";        
        return;        
    }

    if(cart.length === 0) return;

    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    const cartItems = cart.map((item) => {
        return (
            `${item.nome}, Quantidade: (${item.quantity}), Preço: R$ ${item.price} | `
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "5521981428661"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "blank")

    cart = [];
    updateCartModal();
})

function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 9 && hora < 22;
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600")
}else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}