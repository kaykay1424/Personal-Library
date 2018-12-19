$( document ).ready(function() {
  var items = [];
  var itemsRaw = [];
  
  $.getJSON('/api/books', function(data) {
    //var items = [];
    itemsRaw = data;
    if (data.length === 0) {
      $(`<p>No books in the library</p>`).insertBefore('#bookDetail');
      $('#detailTitle, #deleteAllBooks').remove();
      return false;
    }
    let table = `<table><thead><tr><th>Title</th><th>Comment(s)</th><th>Comment Count</th></tr></thead><tbody>`;
    $.each(data, function(i, val) {
      table += `<tr id=${val._id} class="book-row" ><td>${val.title}</td><td class="book-comments">`;
      for (let i = 0; i < val.comments.length;i++) {
        if (i < val.comments.length - 1) {
          table += `-${val.comments[i]}</br />`
        }
      else {
        table += `-${val.comments[i]}`
      }
        
        
      }
                          table += `</ul></td><td class="comment-count"> ${val.commentcount}</td></tr>`
      items.push('<li class="bookItem" id="' + i + '">' + val.title + ' - ' + val.commentcount + ' comments</li>');
      return ( i !== 14 );
    });
    table += `</tbody></table>`;
    $(table).appendTo('#display');
    /*if (items.length >= 15) {
      items.push('<p>...and '+ (data.length - 15)+' more!</p>');
    }
    $('<ul/>', {
      'class': 'listWrapper',
      html: items.join('')
      }).appendTo('#display');*/
  });
  
  var comments = [];
  var form = ``;
  $('#display').on('click','li.bookItem',function() {
    alert('yo');
    $("#detailTitle").html('<b>'+itemsRaw[this.id].title+'</b> (id: '+itemsRaw[this.id]._id+')');
    $.getJSON('/api/books/'+itemsRaw[this.id]._id, function(data) {
      comments = [];
      $.each(data.comments, function(i, val) {
        comments.push('<li>' +val+ '</li>');
      });
      comments.push('<br><form id="newCommentForm"><input style="width:300px" type="text" class="form-control" id="commentToAdd" name="comment" placeholder="New Comment"></form>');
      comments.push('<br><button class="btn btn-info addComment" id="'+ data._id+'">Add Comment</button>');
      comments.push('<button class="btn btn-danger deleteBook" id="'+ data._id+'">Delete Book</button>');
      $('#detailComments').html(comments.join(''));
    });
  });
  
  $(document).on('click','.deleteBook',function(e) {
      e.preventDefault();
      let id = $('.selected-book').prop("id");
    $.ajax({
      url: '/api/books/'+id,
      type: 'delete',
      success: function(data) {
        $('#' + id).remove();
        //update list
        //$('#detailComments').html('<p style="color: red;">'+data+'<p><p id="refresh">Refresh the page</p>');
      }
    });
  }); 
  
                          
  $(document).on('click', '.book-row', (e) => {
      let commentForm = ` <form id="newCommentForm" >
        <input type="text" class="comment-to-add" name="comment" placeholder="Add a comment" style="width: 295px">
        <button class="submit-comment " type="submit" value="Submit" id="newBook">Add a comment!</button>
      </form>`;
    $('#newCommentForm').remove();
    $('.deleteBook').not('#deleteAllBooks').remove();
    let row = $(e.target).parent();
    let id = $(this).prop("id");
    $('.book-row').removeClass("selected-book");
    row.addClass("selected-book");
     
    let deleteBookButton = `<button class="btn btn-danger deleteBook" >Delete Book</button>`;
      $(commentForm).insertAfter('#display')
    $(deleteBookButton).insertAfter('#display')
    
      })

  
  $(document).on('click','.submit-comment',function(e) {
    e.preventDefault();
    var newComment = $('.comment-to-add').val();
    let id = $('.selected-book').prop("id");
    console.log(id)
    $.ajax({
      url: '/api/books/'+id,
      type: 'post',
      dataType: 'json',
      data: $('#newCommentForm').serialize(),
      success: function(data) {
        console.log(data.commentcount);
        let bookComments = $('#' +id).find('.book-comments').html();
        $('#' +id).find('.book-comments').html(bookComments + "<br/>-" +newComment);
        $('#' +id).find('.comment-count').html(data.commentcount);
        //comments.unshift(newComment); //adds new comment to top of list
        //$('#detailComments').html(comments.join(''));
      }
    });
  });
  
  $('#newBook').click(function(e) {
    e.preventDefault();
    let bookTitle = $('#bookTitleToAdd').val();
    $.ajax({
      url: '/api/books',
      type: 'post',
      dataType: 'json',
      data: $('#newBookForm').serialize(),
      success: function(data) {
        console.log(data._id)
        if ($('table').length === 0) {
          let table = `<table><thead><tr><th>Title</th><th>Comment(s)</th><th>Comment Count</th></tr></thead>`
          table += `<tr id=${data._id} class="book-row" ><td>${bookTitle}</td><td class="book-comments"></td><td>0</td></tr>`
          table += `</tbody></table>`;
          $(table).appendTo('#display');
        }
        $('tbody').append(`<tr id=${data._id} class="book-row" ><td>${bookTitle}</td><td class="book-comments"></td><td>0</td></tr>`);
      }
    });
  });
  
  $('#deleteAllBooks').click(function() {
    $.ajax({
      url: '/api/books',
      type: 'delete',
      dataType: 'json',
      data: $('#newBookForm').serialize(),
      success: function(data) {
        //update list
        $('table').remove();
        $(`<p>No books in the library</p>`).insertBefore('#bookDetail')
      }
    });
  }); 
  
});