function requesttring(){
    var checkboxes = document.querySelectorAll('input[name="work"]');
    var num = checkboxes.length;
    
    var varflag = 0;
    var varprom = 3;
    
    if(document.getElementById("nutzername").value == ""){
        alert("Nutzername bitte Ausfüllen ich weiß sonst nicht was ich suchen soll :(");
        return;
    }
    var pfad = "https://pr0gramm.com/api/items/get?user=" + document.getElementById("nutzername").value;

    for (var i=0; i<num; i++) {
        if (checkboxes[i].checked === true) {
            switch(checkboxes[i].value){
            case "sfw":
                varflag = varflag + 9;
                break;

            case "nsfw":
                varflag = varflag + 2;
                break;

            case "nsfl":
                varflag = varflag + 4;
                break;
                    
            case "nsfp":
                if(varflag != 15){ 
                    varflag = varflag + 8;
                }
                break;


            case "neu":
                if(varprom != 1){      
                    varprom = 0; 
                } 
                break;

            case "beliebt":
                    if(varprom != 0){
                        varprom = 1;  
                    }
                break;
            }
        }
    }
    
    if(varprom == 0 || varprom == 1){
        pfad = pfad + "&promoted=" + varprom
    }
    
    if(varflag != 0 && varflag != 9){
        pfad = pfad + "&flags=" + varflag
    }
    apiabfrage(pfad)
}

var  count = 0;

var upvote = 0;      // ALLE Upvotes
var downvote = 0;    // ALLE Downvotes
 
var highvote = 0;    // HÖCHSTER Post
var minvote = 0;     // NIEDRIGSTER Post
 
var neuvote = 0;     // NEU +
var belvote = 0;     // BELIEBT +
 
var nsflvote = 0;    // NSFL +
var nsflcount = 0;

var sfwvote = 0;     // SFW +
var sfwcount = 0;

var nsfwvote = 0;    // NSFL +
var nsfwcount = 0;

var nsfpvote = 0;    // NSFP +
var nsfpcount = 0;
 
var nowbeni = 0;     // AKTUELLE BENI +
var durchbeni = 0;   // DURCHSCHNITTLICHE BENIS

var old_element = 0;

function apiabfrage(pfad){
    $.ajax({
        url: pfad,
        method: "get",
        data: {
            format: 'json'
        },
        success: function(data){
            if(data.items.length == 0){
                anzeigen()
                return;   
            }
            var last_element = data.items[data.items.length - 1].id; 
            
            if(pfad.includes("&older=") == false){
                pfad = pfad + "&older=" + last_element;
            }else{   
                pfad = pfad.replace(old_element, last_element);
            }
            
            old_element = last_element;
            
            count = count + data.items.length;
            
            for (var aktrow = 0; aktrow < data.items.length; aktrow++){
                upvote   = upvote + data.items[aktrow].up;
                downvote = downvote + data.items[aktrow].down;
                
                var vote = data.items[aktrow].up - data.items[aktrow].down;
                var novote = data.items[aktrow].down - data.items[aktrow].up;
                
                if(vote > highvote){
                    highvote = vote;
                }
                
                if(novote > minvote){
                    minvote = novote;
                }
                
                switch(true){
                    case (data.items[aktrow].promoted == 0):
                        neuvote = neuvote + (data.items[aktrow].up - data.items[aktrow].down);   
                        break;
                        
                    case (data.items[aktrow].promoted > 0):
                        belvote = belvote + (data.items[aktrow].up - data.items[aktrow].down);   
                        break;
                }
                
                switch(true){
                    case (data.items[aktrow].flags == 1):
                        sfwvote = sfwvote + data.items[aktrow].up; 
                        sfwcount = sfwcount + 1;
                        break;
                    
                    case (data.items[aktrow].flags == 2):
                        nsfwvote = nsfwvote + data.items[aktrow].up;   
                        nsfwcount = nsfwcount + 1;
                        break;
                    
                    case (data.items[aktrow].flags == 4):
                        nsflvote = nsflvote + data.items[aktrow].up;
                        nsflcount = nsflcount + 1;
                        break;
                    
                    case (data.items[aktrow].flags == 8):
                        nsfpvote = nsfpvote + data.items[aktrow].up;
                        nsfpcount = nsfpcount + 1;
                        break;
                }
            }
                        
            nowbeni = upvote - downvote;
            durchbeni = nowbeni / count;
            
            apiabfrage(pfad);
        }
    })
}

function anzeigen(){
    $('.q').attr('disabled', true);
    
    $('#maxb').val(highvote)
    
    minvote = -minvote
    
    if(minvote == 0){
        minvote = "Keine Negativ Posts"
    }
    
    $('#minb').val(minvote)
    $('#durb').val(durchbeni)
    
    $('#nsflb').val(nsflvote)
    $('#sfwb').val(sfwvote)
    $('#nsfwb').val(nsfwvote)
    $('#nsfpb').val(nsfpvote)
    
    $('#ausw').html("Auswertung: " + count + " Posts")
    
    $('#l').html("Gezählt: " + nsflcount)
    $('#s').html("Gezählt: " + sfwcount)
    $('#w').html("Gezählt: " + nsfwcount)
    $('#p').html("Gezählt: " + nsfpcount)
    
    //$('#naxb').val(neuvote)
    //$('#bmaxb').val(belvote)
    
    $('#plusb').val(upvote)
    downvote = -downvote
    $('#minusb').val(downvote)
    $('#insb').val(nowbeni)
    
    
}