// Products and cart functions

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

// Timer classes and functions

function Timer(counterTarget) {
    this.counterTarget = counterTarget;
    this.timerStartValue;
    this.timerCounterRef;
    this.timerCounterRefOutOfTime = false;
    this.start = function(startValue) {
        this.timerStartValue = parseInt(startValue);

        if (isNaN(this.timerStartValue)) {
            this.counterTarget.innerHTML = 'Podaj liczbę';
            return;
        }
        else if (startValue <= 0) {
            this.counterTarget.innerHTML = 'Podaj liczbę większą od 0';
            return;
        }

        this.stop();

        this.timerCounterRefOutOfTime = false;
        this.counterTarget.innerHTML = this.parseSecondsToDhms(this.timerStartValue);

        if (this.timerCounterRef || this.timerStartValue <= 0) {
            this.stop();
            return;
        }

        this.startTimer();
    }
    this.startTimer = function () {
        var self = this;
        this.timerCounterRef = setInterval(function() {
            if (self.timerStartValue <= 0) {
                this.stop();
                self.counterTarget.innerHTML = 'Czas minął';
                self.timerCounterRefOutOfTime = true;
                return;
            }
            --self.timerStartValue;
            self.counterTarget.innerHTML = self.parseSecondsToDhms(self.timerStartValue);
        }, 1000);
    }
    this.stop = function() {
        clearInterval(this.timerCounterRef);
        this.timerCounterRef = undefined;
    }
    this.parseSecondsToDhms = function (sec) {
        var seconds = Number(sec);
        var d = Math.floor(seconds / (3600 * 24))
        var h = Math.floor((seconds % (3600 * 24)) / 3600)
        var m = Math.floor((seconds % 3600) / 60)
        var s = Math.floor(seconds % 60)

        // num (value, ['zero elementów', 'jeden element', 'dwa elementy'], [true - pominięcie wartości na wyjściu])

        var num = function (value, numerals, wovalue) {
            var t0 = value % 10,
                t1 = value % 100,
                vo = [];
            if (wovalue !== true)
                vo.push(value);
            if (value === 1 && numerals[1])
                vo.push(numerals[1]);
            else if ((value == 0 || (t0 >= 0 && t0 <= 1) || (t0 >= 5 && t0 <= 9) || (t1 > 10 && t1 < 20)) && numerals[0])
                vo.push(numerals[0]);
            else if (((t1 < 10 || t1 > 20) && t0 >= 2 && t0 <= 4) && numerals[2])
                vo.push(numerals[2]);
            return vo.join(' ');
        };

        var dDisplay = d > 0 ? d + (d == 1 ? " dzień " : " dni ") : ""
        var hDisplay = h > 0 ? h + (num(h, [' godzin ', ' godzina ', ' godziny '], true)) : ""
        var mDisplay = m > 0 ? m + (num(m, [ ' minut ', ' minuta ', ' minuty '], true)) : ""
        var sDisplay = s > 0 ? s + (num(s, [' sekund', ' sekunda', ' sekundy'], true)) : ""
        return dDisplay + hDisplay + mDisplay + sDisplay
    }
}

$(document).ready(() => {

    // Products and cart onload instructions

    $(".product > img").attr("draggable", "false");

    $(".product").each(function () {
        $(this).hover(hoverOnProduct, hoverOffProduct)
        .attr('draggable', 'true')
        .on('dragstart', function (e) {
            e.originalEvent.dataTransfer.setData("product-name", $(this).find(".product-name").text());
            e.originalEvent.dataTransfer.setData("product-price", $(this).find(".product-current-price").text());
            $("#dragdrop-hint").css("font-weight", "bold");
        })
        .on('dragend', function () {
            $("#dragdrop-hint").css("font-weight", "normal");
        })
        .on('contextmenu', function (e) {
            e.preventDefault();
        })
        .dblclick(function () {

            var productName = $(this).find(".product-name").text();
            var productPrice = $(this).find(".product-current-price").text().replace(',' , '.');

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

    //Timer onload instructions

    var promoRTimeTarget = document.getElementById("promo-remaining-time");

    var promoTimer = new Timer(promoRTimeTarget);

        //Provide remaining time in seconds

    promoTimer.start(599999);

})