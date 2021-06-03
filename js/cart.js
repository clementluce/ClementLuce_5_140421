function createCart(){
    // si localStorage inexistant
    if(localStorage.length == 0){
        localStorage.setItem("productsInCart", "[]"); // creation d'un tableau "productsInCart" dans localStorage
    }
}
function addToCart(id, price){
    let btnCart = document.getElementById("addCart");
    // si le bouton "addCart" est cliqué
    btnCart.addEventListener("click", function (e){
        let qty = document.getElementById("qty").value;
        let color = document.getElementById("colors").value;
        let productsInCartArray = JSON.parse(localStorage.getItem("productsInCart"));
        let found = false;
        // "pour chaque élement qu'on teste"
        for(let i = 0; i < productsInCartArray.length; i++)
        {
            // si le produit est dans localstorage, on modifie la quantité
            if(productsInCartArray[i].id == id)
            {
                productsInCartArray[i].qty = qty;
                localStorage.removeItem("productsInCart"); 
                document.getElementById('modal').style.display = 'flex';
                found = true;
                break;
            }
        }
        //le produit n'est pas dans localstorage, on l'ajoute
        if(!found){
            let newProductArray = { 'id': id, 'qty': qty, 'color' : color, 'price': price };
            productsInCartArray.push(newProductArray);
            localStorage.removeItem("productsInCart");
            document.getElementById('modal').style.display = 'flex';
        }
        localStorage.setItem("productsInCart", JSON.stringify(productsInCartArray)); 
    });
}
function getCart(){
    // récupération du contenu localStorage
    let productsInCart = JSON.parse(localStorage.getItem("productsInCart"));
    let cartList = document.getElementById("cartList");
    let totalCell = document.getElementById("total");
    let somme = 0;
    // si le tableau localStorage n'est pas vide
    if(localStorage.getItem("productsInCart").length > 2){
        // pour chaque ID de produit dans localStorage, on récupère les infos complètes
        for(let i = 0; i < productsInCart.length; i++){
            fetch("http://localhost:3000/api/teddies/" + productsInCart[i].id)
            .then(function (response){
                return response.json();
            })
            .then(function (data){
                cartList.innerHTML = cartList.innerHTML + '<tr><td><img src="' + data['imageUrl'] + '" class="cartThumb"></td><td>' + data['name'] + '<br><span class="small">' + productsInCart[i].color + '</span></td><td>' + data['price'] + ' €</td><td class="qtyCell">' + productsInCart[i].qty + '<div><a href="product.html?id=' + data['_id'] + '" class="btnCartQty">Modifier</a><a href="" id="delete' + data['_id'] + '" class="btnCartQty red">Supprimer</a></div></td><td>' + data['price'] * productsInCart[i].qty + ' €</td></tr>';
                var btnDelete = document.getElementById('delete' + data['_id']);
                document.addEventListener('click', function(e){
                    if(e.target && e.target.id== 'delete' + data['_id'] ){
                        deleteProduct(data['_id']);
                    }
                });
            })
            .catch(function (err){
                console.log(err);
            });
            somme +=  productsInCart[i].price * productsInCart[i].qty;
        }
        totalCell.innerText = somme + ' €';
    }
    // si le tableau localStorage est vide
    else{
        cartList.innerHTML = cartList.innerHTML + '<tr><td colspan="5">Votre panier est vide !</td></tr>';
        totalCell.innerText = somme + ' €';
    }
}
function deleteProduct(id){
    let productsInCart = JSON.parse(localStorage.getItem("productsInCart"));
    // pour chaque élement de localStorage que l'on teste
    for(let i = 0; i < productsInCart.length; i++){
        // si l'id de objet correspond, on le supprime de localStorage
        if(productsInCart[i].id == id){
            productsInCart.splice(i, 1);
            localStorage.setItem("productsInCart", JSON.stringify(productsInCart));
        }
    }
}
function sendOrder(){
    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");
    const address = document.getElementById("address");
    const city = document.getElementById("city");
    const email = document.getElementById("email");
    let idList = [];
    let productsInCart = JSON.parse(localStorage.getItem("productsInCart"));
    // pour chaque élement de localStorage
    for(let i = 0; i < productsInCart.length; i++){
        // on le duplique autant de fois que la quantité nécéssaire pour le tableau de produits à envoyer
        for(let x = 0; x < productsInCart[i].qty; x++){
            idList.push(productsInCart[i].id);     
        }
    }
    // si le tableau localStorage n'est pas vide
    if(localStorage.getItem("productsInCart").length > 2){
        return new Promise(function(resolve, reject){ 
            let req = new XMLHttpRequest();
            let data = { contact : { "firstName" : firstName.value, "lastName" : lastName.value, "address" : address.value, "city" : city.value, "email" : email.value }, products : idList };
            console.log(data);
            req.open('POST', 'http://localhost:3000/api/teddies/order');
            req.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
            req.onload = function(){
                // 201 : requête traitée "created"
                if (req.status == 201){
                    resolve(req.response);
                    localStorage.setItem("orderArray", req.response);
                    document.location.href="order.html";
                }
                // erreur dans la requête
                else{ 
                    reject(Error(req.statusText)); 
                } 
            }
            req.onerror = function(){
                reject(Error("Network Error")); 
            }
            req.send(JSON.stringify(data));
        });
    }
}
function getOrder(){
    let orderArray = JSON.parse(localStorage.getItem("orderArray"));
    let orderId = document.getElementById("orderId");
    let nameSpan = document.getElementById("nameSpan");
    let locationSpan = document.getElementById("locationSpan");
    let priceSpan = document.getElementById("priceSpan");
    let total = 0;
    // affichage des informations de commande
    orderId.innerText = orderArray["orderId"];
    nameSpan.innerText = orderArray["contact"]["firstName"] + ' ' + orderArray["contact"]["lastName"];
    locationSpan.innerText = orderArray["contact"]["address"] + ' ' + orderArray["contact"]["city"];
    // calcul du total de la commande
    for(let i = 0; i < orderArray["products"].length; i++)
    {
        total +=  orderArray["products"][i].price;
    }
    priceSpan.innerText = ' ' + priceSpan.innerText + total + ' €';
    localStorage.clear();
}
let myCart = document.getElementById("myCart");
if(myCart){
    myCart.addEventListener("load", getCart());
}
let myOrder = document.getElementById("myOrder");
if(myOrder){
    myOrder.addEventListener("load", getOrder());
}
createCart();