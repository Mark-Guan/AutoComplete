/*
A program to implement the common autocomplete functionality for a given set of terms.
Date: 10/15/17
Author: Mark Guan
*/


(function () {
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
    
    wikitionary = readTextFile("wiktionary.txt");
    
    console.log(wikitionary);
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

//
//// Compares the two terms in lexicographic order but using only the first r characters of each query.
//function biggerAlphabeticallyPrefix(firstTerm, secondTerm, r) {
//    return firstTerm.query.substring(0,r) > secondTerm.query.substring(0,r)
//}

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
function readTextFile(file) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                return allText;
            }
        }
    }
    rawFile.send(null);
}