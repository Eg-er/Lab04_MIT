import './scss/main.scss';
console.log('Hello!');

var cart = {};
var goods = {};
var catDescr = {};
var currentCategory;


$('document').ready(function () {
    loadCategories();
    loadCategoryProducts(0);
    initCart();
    console.log(cart);
    $('.openbtn').on('click', function(){
        showCart();
    });
    
});
function loadCategories(){
	$.getJSON("https://nit.tron.net.ua/api/category/list",function(data){
		var out = '';
		out+='<li class="category-pos current" data-id="0">All products</li>'
		catDescr[0] = 'All products';
		currentCategory = 0;
		   $('#goods-content-header').html(catDescr[currentCategory]);
		var catID;
        for (var key in data){
            catID = data[key]['id'];
            out+='<li class="category-pos" data-id="'+catID+'">' + data[key]['name'] + '</li>';
            catDescr[catID] = data[key]['description'];
        }
        
		$('#categories-list ul').html(out);

$('li.category-pos').on('click',function(){
	var id = $(this).attr('data-id');
	if(currentCategory!==id){
		loadCategoryProducts(id);
		$('#goods-content-header').html(catDescr[id]);
		$('.curr').removeClass('curr');
		$(this).addClass('curr');
		currentCategory=id;

	}
	});
});
}

function loadCategoryProducts(id){
	var src = '';
	if(id==0) src = "https://nit.tron.net.ua/api/product/list";
	else src = 'https://nit.tron.net.ua/api/product/list/category/'+id;
    $.getJSON(src,function(data){
    	goods = data;
    	var out = '';
    	out+='<section class = "text-center mb-4" ">';
  out+='<div class = "container-fluid">';
  out+='<div class = "row wow fadeIn">';
  
    	for(var key in data){

    		out+='<div class = "col-lg-3 col-md-4 col-sm-6 mb-4">';

    		var goodsId = data[key]['id'];
    	var name = data[key]['name'];
    	var image = data[key]['image_url'];
    	var price = data[key]['price'];
    	var specialprice = data[key]['special_price'];
    	
    	out+='<div class="card">';

    	out+='<div class="goods-img-container">';
    	out+='<img class="goods-img" src ="'+image+'" alt"'+name+'">';
    	out+='</div>';
    	out+='<span class="goods-name show-good-info" data-art="'+goodsId+'">'+ name +'</span>';
    	if (specialprice!=null){
                out+='<span class="old-price ">'+ price +' грн'+ '</span>';
                out+='<span class="new-price">'+specialprice +' грн'+'</span>';
            }
            else{
                out+='<span class="price">'+ price +' грн'+ '</span>';
            }
            out+='<button class="add-to-cart  btn btn-warning" data-id="'+ goodsId +'" data-obj="'+key+'">Add to cart</button>';
          
            out+='</div>';
            out+='</div>';
           
    }
    out+='</div>';
    out+='</div>';
    out+='</section>';

	$('#goods-container').html(out);
	$('button.add-to-cart').on('click',function(){
		var it = parseInt($(this).attr('data-obj'));
		var id = $(this).attr('data-id');
		if(cart[id]!=undefined){
			cart[id].amount++;
		}else{
			cart[id]={};
			cart[id].name = data[it]['name'];
			cart[id].amount = 1;
		
		if(data[it]['special_price']!=null){
			cart[id].price = data[it]['special_price'];
		}else{
			cart[id].price = data[it]['price'];
		}
	}
localStorage.setItem('cart',JSON.stringify(cart));
	showCart();
});
	$('.show-good-info').on('click', function(){
            var id = $(this).attr('data-art');
            showIcon(id);
        });
    });
}
function showIcon(id){
	console.log(id);
	var src = 'https://nit.tron.net.ua/api/product/'+id;
$.getJSON(src,function(data){
	var out = '';

	out+='<div id = "id1" class = "modal">';
	out+='<div class="modal-content animate">';

	out+='<div class="imgcontainer">';
	out += '<span class="close" title="Close Preview">&times;</span>';
    out+='<img class="itemImage" src="' + data['image_url'] + '" alt="Goods image">'+'</div>';
    out+='<div class="container">';
    out+='<p class="icon-goods-name">' + data['name'] + '</p>';
    out+='<p class="icon-description">' + data['description'] + '</p>';
    out+='</div>';
    out+='<div class="container icon-price-container">';
    out+='<p class="icon-price-header" style="">Price</p>';
    if(data['special_price']===null){
    	out+='<p class = "price">'+data['price']+' грн</p>';
    }else{
    	out += '<p class="descr-old-price">' + data['price'] + ' грн. </p>'+'<p class="descr-new-price">' + data['special_price'] + ' грн. </p>';
        
    }
    out += '</div>';
   
    out += '<button class="cancel-btn btn btn-sm btn-red" type="button">Cancel</button>';
    out += '<button class="add-button btn btn-sm btn-green " data-art="' + data['id'] + '"> Add to cart </button>';
   
    out += '</div>';
    out += '</div>';

    $('#preview-frame').html(out);
    document.getElementById('id1').style.display = 'block';
    $('.cancel-btn').on('click', function () {
        document.getElementById('id1').style.display = "none";
    });
    $('.close').on('click', function () {
        document.getElementById('id1').style.display = "none";
    });
    var modal = document.getElementById('id1');
    window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
        }
    }
    $('.add-button').on('click', function(){
        var id = $(this).attr('data-art');
        if(cart[id]!=undefined){
        	cart[id].amount++;
        }else{
        	cart[id]={};
        	cart[id].name = data['name'];
        	cart[id].amount = 1;
        
        if(data['special_price']!=null){
        	cart[id].price = data['special_price'];

        }else{
        	cart[id].price = data['price'];
        }
    }
        localStorage.setItem('cart',JSON.stringify(cart));




});
});
}
function isEmpty(obj){
	for(var i in obj){
		if(obj.hasOwnProperty(i))
			return false;
	}
	return JSON.stringify(obj) === JSON.stringify({});
}
function showCart(){
	var total = 0;
	if(!(isEmpty(cart))){
		
		var out = '';
		for(var i in cart){
			 out += "<tr>"
      + "<td class = 'name'>" + '<span class="show-good-info" data-dismiss="modal" data-art = "'+i+'">' + cart[i].name + '</span>' 
      +" "+ cart[i].price  +"₴ </tr>"+"<tr>" 
      +  "</td>" 
      + "<td><div class='input-group'><button class='minus-item input-group-addon btn-up ' data-art=" + i  + ">-</button>"
      + "<input type='number' class='item-count form-control' data-art=" + i + "' value='" + cart[i].amount + "'>"
      + "<button class='plus-item btn-up input-group-addon' data-art=" + i + ">+</button></div></td>"
      + "<td><button class='delete-item btn-up btn-danger' data-art=" + i + ">X</button></td>"
      + " = " 
      
      +  "</tr>";
      total+=cart[i].amount * cart[i].price;
			
            console.log(cart);
		}
		$('.total-cart').html(total);
		$('#btn-order').prop('disabled', false);
		out += '<div class="cart-item-down">';
        out += '<span class="cart-item-cost">Total: '+ total +' грн</span>';
        
        out += '</div>';
        
        $('.cart-content').html(out);
        $('.btn-order').on('click', function(){
            Order(total);

           
        });
        $('.show-good-info').on('click', function(){
            var id = $(this).attr('data-art');
           
            showIcon(id);
        });
        $('.minus-item').on('click', function(){
            var id = $(this).attr('data-art');
            if(cart[id].amount>1){
                cart[id].amount--;
            }
            else if (cart[id].amount > 0) delete cart[id];
            localStorage.setItem('cart',JSON.stringify(cart));
            showCart();
        });
        $('.plus-item').on('click', function(){
            var id = $(this).attr('data-art');
            cart[id].amount++;
            localStorage.setItem('cart',JSON.stringify(cart));
            showCart();
        });
        $('.delete-item').on('click', function(){
            var id = $(this).attr('data-art');
            cart[id].amount=0;
            delete cart[id];
            showCart();
            localStorage.setItem('cart',JSON.stringify(cart));
        });
    

	}else{
		$('#btn-order').prop('disabled', true);
		var out = '<p> Корзина пуста </p>';
		$('.total-cart').html(total);
		$('.cart-content').html(out);
	}



}
function Order(totalValue){
	var out = '';

        out += '<div id="id01" class="modal modalOrder">';
        out += '<div class="modal-content animate">';

        out += '<div class="imgcontainer">';
        out += '<span class="close" title="Close Preview">&times;</span>';
        out += '<p class="order-title"">Order</p>';
        out += '</div>';

        
        for(var key in cart){
            out+='<span class="show-good-info ord-link" data-dismiss="modal" data-art = "'+key+'">'+cart[key].name+' ('+cart[key].amount+')</span>';
        }
        

        out+='<p class="total-price">Total: ' + totalValue + ' UAH</p>';
        out+='<div class = "order-border"></div>';
        out+='<div class="form-input-container">';

        out+='<form class="form-position" name="AlcoShop_ORDER" action="" method="post">';
        out+='<p class = "total-price">Full name</p>';
        out+='<input type="text" name="name" id="defaultContactFormName" class="form-control-1" placeholder="Name">';
        out+='<p class = "total-price">Phone number</p>';
       out+='<input type="text" name="phone" id="defaultRegisterPhonePassword" class="form-control-1" placeholder="Phone number" aria-describedby="defaultRegisterFormPhoneHelpBlock">';
        out+='<p class = "total-price">E-mail</p>';
        out+='<input name="email" type="email" id="materialLoginFormEmail" class="form-control-1" placeholder="e-mail">';
       
        out+='</form>';
        out+='</div>';
out+='<div class = "order-border"></div>';
        out+='<div class="container order-last">';
        out +='<button class="btn btn-sm btn-red cancel-prev-btn" type="button" ">Cancel</button>';
        out+='<button class="btn btn-sm btn-green send-button" id="send">Order</button>';

        out += '</div>';
        out += '</div>';
        out += '</div>';

        $('#preview-frame').html(out);
        $('.show-good-info').on('click', function(){
            var id = $(this).attr('data-art');
           
            showIcon(id);
        });

        document.getElementById('id01').style.display = 'block';
        $('.cancel-prev-btn').on('click', function () {
            document.getElementById("id01").style.display = "none";
            
        });
        $('.close').on('click', function () {
            document.getElementById("id01").style.display = "none";
        });

        $('.send-button').on('click', function(){
            var formData = new FormData(document.forms.AlcoShop_ORDER);
            console.log("Ordered:");
            console.log(cart);
            var myKey;
            for(var x in cart){
                myKey = parseInt(x)+1;
                formData.append("products["+myKey+"]",cart[key].amount);
            }

            formData.append("token", "PklEtAN9GY7U263juWZU");


            var xhr = new XMLHttpRequest();
            xhr.open("POST", "https://nit.tron.net.ua/api/order/add");
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        if(xhr.responseText.indexOf('error')>0){
                            alert("перевірте правильність данних!");
                        }
                        else{
                            for(var y in cart){
                                delete cart[y];
var modal = document.getElementById('id01');
    
           
                modal.style.display = "none";
                            }


                           alert("Замовлення прийняте!!!");
                            localStorage.setItem('cart',JSON.stringify(cart));
                        }
                    }
                }
            }
            
        

            xhr.send(formData);
        });
}
function initCart() {
    if (localStorage.getItem('cart') != null) {
        cart = JSON.parse(localStorage.getItem('cart'));
    }
}
    



