function hoverOnProduct () {
    $(this).css("border", "1px solid");

    $(this).children().eq(1).css({
        backgroundColor: "rgba(0,0,0,0.15)",
        transition: "background-color .3s"
    });
}

function hoverOffProduct () {
    $(this).css("border", "none");
    $(this).children().eq(1).css("background-color", "#fff");
}

function countTotalPrice () {
    var total = 0;
        
    $('.product-price-cart').each(function () {
        total += parseFloat($(this).text());
    })

    $('#price-final').text(total.toFixed(2).replace('.' , ','));
}

function addToCart(productName, productPrice) {
        var li = '<li class="product-in-cart"><b>' + productName + '</b> Cena: <b><span class="product-price-cart">' + productPrice + '</span> zł</b><div class="delete-from-cart">Usuń produkt</div></li>';

        $('#products-in-cart').append(li);

        $('.delete-from-cart:last').click(function () {

                    if ($(this).parent().is(":only-child")) {
                        $("#clear-cart-btn").remove();
                    }

                    $(this).parent().remove();
                    countTotalPrice();
                })

        countTotalPrice();

        if ($('#clear-cart').is(':empty')) {
            var p = '<p id="clear-cart-btn">Wyczyść koszyk</p>';
            $("#clear-cart").append(p);

            $("#clear-cart-btn").click(function () {
                $(this).remove();

                $('.product-in-cart').each(function () {
                    $(this).remove();
                })
                
                countTotalPrice();
            })
        }
}

$(document).ready(() => {

    $(".product > img").attr("draggable", "false");

    $(".product").each(function () {
        $(this).hover(hoverOnProduct, hoverOffProduct)
        .attr('draggable', 'true')
        .on('dragstart', function (e) {
            e.originalEvent.dataTransfer.setData("product-name", $(this).children().eq(1).children().eq(0).text());
            e.originalEvent.dataTransfer.setData("product-price", $(this).children().eq(1).children().eq(1).children().eq(0).text());
            $("#dragdrop-hint").css("font-weight", "bold");
        })
        .on('dragend', function () {
            $("#dragdrop-hint").css("font-weight", "normal");
        })
        .on('contextmenu', function (e) {
            e.preventDefault();
        })
        .dblclick(function () {

            var productName = $(this).children().eq(1).children().eq(0).text();
            var productPrice = $(this).children().eq(1).children().eq(1).children().eq(0).text().replace(',' , '.');

            addToCart(productName, productPrice);
            alert("Dodano do koszyka produkt: " + productName + " Cena: " + productPrice + " zł");
        })
    })

    $("#cart").on('dragover', function (e) {
        e.preventDefault();
    })
    .on('drop', function (e) {
        e.preventDefault();
        var productName = e.originalEvent.dataTransfer.getData("product-name");
        var productPrice = e.originalEvent.dataTransfer.getData("product-price").replace(',' , '.');
        
        if (productName && productPrice) {
            addToCart(productName, productPrice);
        }
    })
})