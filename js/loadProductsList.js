function loadProducts(){
    // récupération de la liste des produits
    fetch("http://localhost:3000/api/teddies/")
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        setDataProducts(data);
    })
    .catch(function (err) {
        console.log(err);
    });
}
function setDataProducts(data) {
    let listeProduits = document.getElementById("product-list");
    // pour chaque produit de la liste, créer une carte et y afficher les infos
    for (let i = 0; i < data.length; i++) {
        let div = document.createElement("div");
        div.classList.add('productLink');
        div.innerHTML = '<a href="product.html?id=' + data[i]._id + '" class="productItem"><img src="' + data[i].imageUrl + '" class="productItemImg"><div class="productItemCaption"><h2 class="productItemName">' + data[i].name + '</h2><span class="productItemPrice">' + data[i].price + ' €</span></div></a>';
        listeProduits.appendChild(div);
    }
}
loadProducts();