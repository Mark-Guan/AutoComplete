/*
A program to implement the common autocomplete functionality for a given set of terms.
Date: 10/15/17
Author: Mark Guan
*/

// dictionary of words being used for autocomplete
var termArray;

(function () {
    readInTextFile("wiktionary.txt");
    
    console.log(termArray);
    
    var test = new Term("c", 3);
    var test2 = new Term("apple", 15);
    var test3 = new Term("a", 10);
    var test4 = new Term("dog", 27);
    var test5 = new Term("applcup", 29);
    console.log(test)
    arr = [test,test2, test3, test4, test5];
    arr.sort(compareTermsAlphabetically);
    
    console.log(arr);
    console.log(binaryIndexOf("dog", arr));
    
    matches = findAllMatches("a", arr);
    console.log(matches);
})();

//An autocomplete term: a query string and an associated integer weight.
function Term(query, weight) {
    this.query = query;
    this.weight = weight;
}

// Compares the two terms in descending order by weight.
function compareByReverseWeightOrder(firstTerm, secondTerm) {
    if (secondTerm.weight < firstTerm.weight) {
        return -1;
    }
    if (secondTerm.weight > firstTerm.weight) {
        return 1;
    }
    return 0;
}

//Compares the two terms in lexicographic order by query. Used in sorting method.
function compareTermsAlphabetically(firstTerm, secondTerm) {
    if (firstTerm.query < secondTerm.query) {
        return -1;
    }
    if (firstTerm.query > secondTerm.query) {
        return 1;
    }
    return 0;
}

function binaryIndexOf(prefix, arrayOfTerms) {
    var minIndex = 0;
    var maxIndex = arrayOfTerms.length - 1;
    var currentIndex;
    var currentTerm;
 
    while (minIndex <= maxIndex) {
        currentIndex = (minIndex + maxIndex) / 2 | 0;
        currentTerm = arrayOfTerms[currentIndex];
 
        if (currentTerm.query.substring(0,prefix.length) < prefix) {
            minIndex = currentIndex + 1;
        }
        else if (currentTerm.query.substring(0,prefix.length) > prefix) {
            maxIndex = currentIndex - 1;
        }
        else {
            return currentIndex;
        }
    }
    return -1;
}

// Returns all terms that start with the given prefix, in descending order of weight.
function findAllMatches(prefix, arrayOfTerms) {
    arrayOfTermsCopy = arrayOfTerms.slice();
    matches = [];
    indexOfFound = 0;
    while (indexOfFound != -1) {
        indexOfFound = binaryIndexOf(prefix, arrayOfTermsCopy)
        if(indexOfFound != -1)
            matches.push(arrayOfTermsCopy.splice(indexOfFound, 1)[0]);
    }
    matches.sort(compareByReverseWeightOrder);
    return matches;
}

// reads in local text file on the server
function readInTextFile(file) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                console.log("hit");
                var allText = rawFile.responseText;
                storeDictionary(allText);
            }
        }
    }
    rawFile.send(null);
}

function storeDictionary(text) {
    termsArray = []
    var textArray = text.split("\n");
    for(var i = 1; i < textArray.length; i++) {
        var termPieces = textArray[i].split("\t");
        console.log(termPieces);
        termsArray.push(new Term(termPieces[1].trim(), termPieces[0].trim()));
    }
    termArray = termsArray;
}