function requesttring(){
    var checkboxes = document.querySelectorAll('input[name="work"]');
    var num = checkboxes.length;
    
    var varflag = 0;
    var varprom = 3;
    
    
    var pfad = "https://pr0gramm.com/api/items/get?user=" + getElementById("nutzername").value;

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
    
    if(varflag != 0 || varflag != 9){
        pfad = pfad + "&flags=" + varflag
    }
}

function apiabfrage(pfad){
    $.ajax({
        type: "get",
        url: pfad,
        
        success: function(data){
            var last_element = data[data.length - 1].data.id;
            count = count + data.length;
            
            for (aktrow = 0; aktrow < data.length; aktrow++){
                upvote   = upvote + data[aktrow].data.up;
                downvote = upvote + data[aktrow].data.down;
                
                vote = data[aktrow].data.up - data[aktrow].data.down;
                novote = data[aktrow].data.down - data[aktrow].data.up;
                
                if(vote > highvote){
                    highvote = vote;
                }
                
                if(novote > minvote){
                    minhvote = vote;
                }
                
                switch(true){
                    case (data[aktrow].data.promoted == 0):
                        neuvote = neuvote + data[aktrow].data.up;   
                    
                    case (data[aktrow].data.promoted == 1):
                        belvote = belvote + data[aktrow].data.up;   
                    
                        
                    case (data[aktrow].data.flags == 1):
                        sfwvote = sfwvote + data[aktrow].data.up; 
                        break;
                    
                    case (data[aktrow].data.flags == 2):
                        nsfwvote = nsfwvote + data[aktrow].data.up;   
                        break;
                    
                    case (data[aktrow].data.flags == 3):
                        nsflvote = nsflvote + data[aktrow].data.up;
                        break;
                    
                }
            }
                        
            nowbeni = upvote - downvote;
            durchbeni = nowbeni / count;
            
            pfad = pfad + "?older=" + last_element;
                        
            apiabfrage(pfad);
        }
    })
}