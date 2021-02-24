$(() => {
  var table = document.getElementById('the-table');

  var sse = new EventSource('/examples/events');
  sse.addEventListener('message', e => {
    console.log('good news:', e.data, e);

    try {
      var data = JSON.parse(e.data);
    } catch (e) {
      console.error('actually bad news, its not json', e);
    }

    if (data.type === 'post') {
      $(table).find('tbody').prepend(`<tr>
        <td>${data.result}</td>
        <td>${JSON.stringify(data.args)}</td>
        <td>
          <button class="btn btn-danger btn-sm" type="button" data-id="${data.result}">
            Delete
          </button>
        </td>
        </tr>`);
    }

    if (data.type === 'delete') {
      var theId = data.args[0];
      alert('todo implement update ui for deleting', theId);
    }
  });

  // listen for delete events on un-created elements
  // gomakethings.com/listening-for-click-events-with-vanilla-javascript
  document.addEventListener('click', async event => {
    // If the clicked element doesn't have the right selector, bail
    if (!event.target.matches('button')) return;

    var theId = event.target.dataset.id;
    console.log('have to delete', theId);
    try {
      var response = await axios.delete('/examples/' + theId);
      inputValue.disabled = false;
      inputValue.value = "";

      console.log(response);
    } catch (e) {
      console.error(e);
    }
  }, false);

  var form = document.getElementById('the-form');
  var inputValue = document.getElementById('add-value');

  form.addEventListener('submit', async e => {
    e.preventDefault();

    var value = inputValue.value;
    inputValue.disabled = true;
    // await new Promise(r => setTimeout(r, 1000));

    try {
      var response = await axios.post('/examples', {
        value,
      });
      inputValue.disabled = false;
      inputValue.value = "";

      console.log(response);
    } catch (e) {
      console.error(e);
    }
  });

  function appendRow(argument) {
    // body...
  }

});
