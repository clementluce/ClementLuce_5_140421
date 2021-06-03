function loadProduct(){
    let url = new URL(document.location.href);
    let id = url.searchParams.get("id");
    // récupération des informations sur le produit
    fetch("http://localhost:3000/api/teddies/" + id)
    .then(function (response) 
    {
        return response.json();
    })
    .then(function (data)
    {
        setDataProduct(data);
    })
    .catch(function (err)
    {
        console.log(err);
    });
}
function setDataProduct(data)
{
    // construction de la carte
    console.log(data);
    let filArianeLink = document.getElementById("product-fa");
    let img = document.getElementById("img");
    let name = document.getElementById("name");
    let description = document.getElementById("description");
    let price = document.getElementById("price");
    let colorSelect = document.getElementById("colors");
    filArianeLink.innerHTML = data['name'];
    img.src = data['imageUrl'];
    name.innerText = data['name'];
    description.innerText = data['description'];
    price.innerHTML = data['price'] + ' €';
    // construction du select pour le choix de la couleur
    for (let i = 0; i < data['colors'].length; i++) {
        var option = data['colors'][i];
        colorSelect.options.add(new Option(option));
    }
    let qty = document.getElementById("qty");
    if(localStorage.length != 0)
    {
        let productList = JSON.parse(localStorage.getItem("productsInCart"));
        for (let i = 0; i < productList.length; i++) 
        {
            // si le produit est déjà dans localStorage
            if(productList[i].id == data['_id'])
            {
                // on définit la valeur de l'input number de quantité avec la quantité existante
                qty.value = productList[i].qty;
            }
        }       
    }
    if (document.getElementById('addCart') != null)
    {
        addToCart(data['_id'], data['price']);
    }
}
loadProduct();