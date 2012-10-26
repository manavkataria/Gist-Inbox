//Parse Dictionary:
   function parseDictionary() {   

    var obj = {abc: 5, mc: 34};
    for (var key in obj) {
        var value = obj[key];
        console.log(key);
        console.log(value);
        // now you can use key as the key, value as the... you guessed right, value
    }

   }

   parseDictionary();
