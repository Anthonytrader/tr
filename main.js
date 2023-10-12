//CODIGO de JACVA SCRIPT PARA EL CARRITO DE COMPRAS//



async function getApi(){
 const BASE_URL="https://ecommercebackend.fundamentos-29.repl.co/";
 try{
    const data = await fetch(BASE_URL);
    const res= await data.json();
    console.log(res);
    localStorage.setItem("products",
    JSON.stringify(res));
   return res; 
 }
 catch (error){
    console.log(error,"error");
 }

}

async function database(){
   const db = {
    
     products: JSON.parse(localStorage.getItem("products"))|| await getApi(),
      cart: JSON.parse(localStorage.getItem("cart"))|| {},    
   }
   return db;
}
function handels() {
   const btn = document.querySelector(".Items_btn");
  const list = document.querySelector(".Items_list"); 
  const cart = document.querySelector (".cart_btn");
  const modal = document.querySelector(".cart_modal");
   btn.addEventListener("click", function(){
     list.classList.toggle("active");
   });
   list.addEventListener("click", function(){
    list.classList.remove("active");

   });

   cart.addEventListener("click", ()=> {
    modal.classList.toggle("active");
      // if (modal.classList.contains('active')) {
      //    modal.classList.remove("active");
      // } else  {
      //    modal.classList.add("active");
      // }
   })

}


// function main(){
//    handels();
// }
// main();

function printProducts( products){
const print = document.querySelector(".products");
let html=" ";
for (const item of products){
   //console.log(item);
   const{ category,id ,image,price, quantity }= item;
   html +=  `
   <div id="${id}"class="product">
            <figure class="product_img if${quantity}">
            <img src="${image}" alt="image product">
            </figure>
            <p
            class="product_description">
            <span>Categoria:</span>${category}<br>
            <span>precio:</span> ${price} USD<br>
            <span>Cantidad:</span>${quantity} Units<br>
            </p>
            <div class="product_buttons">
              <button
              class="btn_view"> Ver detalles</button>
              <button class ="btn_add"> Agregar al carrito</button>
            </div>
   </div>
            `
   
}
print.innerHTML = html;

}

function addtoCart(db){
  const add= document.querySelector(".products");
  add.addEventListener("click",(event)=>{
   if(event.target.classList.contains("btn_add")){
    const id = +event.target.closest(".product").id;
    const article = db.products.find(element => element.id===id);
    //console.log(article);
     if(article.quantity===0){
      return alert("Este producto se encuentra agotado");
     }

    if(article.id in db.cart){
      if(db.cart[id].amount===db.cart[id].quantity){
         return alert("No tenemos mas en bodega");
      }
      db.cart[article.id].amount++;
    } else{
      article.amount= 1;
      db.cart[article.id] = article;
    }
 console.log(db.cart);
 localStorage.setItem("cart", JSON.stringify(db.cart));
 printCart(db.cart);
 printTotals(db);
}
  });
   
}
function printCart( products){
 const print= document.querySelector(".cart_products");
 let html=``;
 for (const key in products){
   //console.log(products[key]);
   const {amount, category,id, image,price,quantity} = products[key];
   html += ` 
   
   <div id="${id}" class="cart_product">
   <figure class="cart_product_img">
     <img src="${image}" alt="image product">
   </figure>
   <div class="cart_product_container">
     <p class="cart_product_description">
       <span>Categoria:</span>${category}
       <br>
       <span>Precio:</span> $${price}
       USD<br>
       <span>Cantidad:</span>${quantity}
       Units<br>
     </p>
    
    <div class="cart_product_buttons">
     <ion-icon class="less"
     name="remove-circle-outline">
   </ion-icon>
   <span>${amount}</span>
   <ion-icon class="plus"
   name="add-circle-outline">
 </ion-icon>
 <ion-icon class="trash"
 name="trash-outline"></ion-icon>
    </div> 
   </div>
 </div> 
  `;
 }
 print.innerHTML=html;
}

function handleCart(db){
   const cart = document.querySelector(`.cart_products`);
   cart.addEventListener(`click`,(event)=>{

     if(event.target.classList.contains("less")){
      //console.log("quiero restar");
     const id= +event.target.closest(".cart_product").id;
     if(db.cart[id].amount===1){
      return alert("Uno es la cantidad minima que puedes comprar");
     }
     db.cart[id].amount--;
   
   }
     if(event.target.classList.contains("plus")){
      //console.log("quiero sumar");
   const id= +event.target.closest(".cart_product").id;
   if(db.cart[id].amount===db.cart[id].quantity){
      return alert("No tenemos mas en bodega");
   }
   db.cart[id].amount++;  
   }
     if(event.target.classList.contains("trash")){
     // console.log("quiero borrar");
     const id= +event.target.closest(".cart_product").id;
     const response= confirm("seguro que quieres borrar este prodeucto");
     if(!response){
      return;
     }
     delete db.cart[id];
     }
     localStorage.setItem("cart", JSON.stringify(db.cart));
     printCart(db.cart);
     printTotals(db);
   })
}

function printTotals(db){
const cartTotal= document.querySelector(".cart_totals div");
let cantidad=0;
let totales=0;
for(const key in db.cart){
   //console.log(db.cart[key]);
   const {amount, price} = db.cart[key];
   cantidad += amount;
   totales += amount * price;

}
let html=`
<p><span>Cantidad:</span>${cantidad} </p>
<p><span>Total:</span>$ ${totales}  USD</p>
`;

cartTotal.innerHTML=html;

}

function handleTotals(db){
  const btnBuy = document.querySelector(".btn_buy");
  btnBuy.addEventListener("click",()=>{
    if(!Object.values(db.cart).length){
      return alert("Debes agregar productos a tu carrito antes de hacer la compra.")
    }
    const response = confirm("Estas seguro de realizar tu compra?");
    if(!response){
      return;
    }
    for(const key in db.cart){
      //console.log(db.cart[key]);
      if(db.cart[key].id===db.products[key-1].id){
        db.products[key-1].quantity -= db.cart[key].amount;
      }
    }
 db.cart = {};
  localStorage.setItem("products", JSON.stringify(db.products));
  localStorage.setItem("cart", JSON.stringify(db.cart));
  printProducts(db.products);
  printCart(db.cart);
  printTotals(db);
  alert("Gracias por su compra!!!");
  });


}

function filterProducts (products) {

  const list=document.querySelectorAll(".Items_list li ");
 // console.log(list);
  list[0].addEventListener("click",()=>{
   printProducts(products);
  });
  list[1].addEventListener("click",()=>{
    const shirts = products.filter(element=>element.category==="shirt");
    printProducts(shirts);
  });
  list[2].addEventListener("click",()=>{
    const hoddies=products.filter(element=>element.category==="hoddie");
    printProducts(hoddies);
  });
  list[3].addEventListener("click",()=>{
    const sweaters=products.filter(element=>element.category==="sweater");
    printProducts(sweaters);
  });
}

 function showDetails(products){
  const realBtn =document.querySelector(".products");
  const showModal=document.querySelector(".view_modal");
  const closeModal=document.querySelector(".close_modal");
  const contentModal=document.querySelector(".content_modal");
  realBtn.addEventListener("click",(event)=>{
    if(event.target.classList.contains("btn_view")){
      const id = +event.target.closest(".product").id;
      const article = products.find(element=>element.id===id);
      console.log(article);
      const { category, description,image, name, price,quantity} = article;
      let html = `   
      <div class="modal_product">
   <figure class="modal_product_img">
     <img src="${image}" alt="image product">
   </figure>
     <p class="modal_product_short">
       <span>Categoria:</span>${category}
       <br>
       <span>Precio:</span> $${price}
       USD<br>
       <span>Cantidad:</span>${quantity}
       Units<br>
     </p>
     <p class="modal_product_long">
      <span>Nombre:</span>${name}<br>
      <span>Descripción:</span>${description}<br>
      </p> `;
      contentModal.innerHTML = html;
      showModal.classList.add("active");
    }
  });
    closeModal.addEventListener("click",()=>{
      showModal.classList.remove("active");
    })
 }
async function main() {

    const db = await database();

  //console.log( db.products);
  handels();
  printProducts(db.products);
  addtoCart(db);
  printCart(db.cart);
  handleCart(db);
  printTotals(db);
  handleTotals(db);
  filterProducts(db.products); 
  showDetails(db.products);
}
main();