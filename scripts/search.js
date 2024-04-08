// Assuming you have loaded your JSON data into a variable called `data`
let data;

// Fetch the data from the JSON file
fetch('tagIndex.json')
  .then(response => response.json())
  .then(json => data = json);

// Get the input element
let input = document.getElementById('search-input');

// Add event listener to the input field
input.addEventListener('keyup', function(event) {
    let value = event.target.value.toLowerCase(); // Convert the input to lowercase
    console.log('Input value:', value); // Debug line
  let results = [];

  // Search the data
  for (let word in data) {
    if (word.includes(value)) {
      results = results.concat(data[word]);
    }
  }

  console.log('Search results:', results); // Debug line
  // Update the search results
  updateSearchResults(results);
});

function updateSearchResults(results) {
    console.log('Updating search results with:', results); // Debug line
    let resultsElement = document.getElementById('search-results');
  
    // Clear the results
    resultsElement.innerHTML = '';
  
    // Remove duplicates from results
    results = removeDuplicates(results);
  
    // Limit the results to the top 5
    results = results.slice(0, 5);
  
    // Add the new results
    for (let result of results) {
        let li = document.createElement('li');
        let link = document.createElement('a');
        let img = document.createElement('img');
        
        link.href = result.file;
        link.textContent = result.title;
        
        img.src = result.thumbnail;
        img.style.width = '100%'; // Set the width of the image to 100%
        img.style.height = 'auto'; // Let the height adjust automatically
        img.style.marginRight = '1em'; // Add some space to the right of the image

        li.appendChild(img);
        li.appendChild(link);
        resultsElement.appendChild(li);
    }
}

function removeDuplicates(results) {
    let unique = {};
    results.forEach(function(i) {
        if(!unique[i.file]) {
            unique[i.file] = i;
        }
    });
    return Object.values(unique);
}