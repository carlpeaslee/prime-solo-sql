  var employeeArray = [];

$(document).ready(function(){
  checkServer();
  $('#employeeForm').on('submit', submitEmployee);
  $('.results-div').on('click', '.delete', deleteEmployee);
});

function submitEmployee(){   //when you click the submit button we will...

  event.preventDefault();

  var employeeValues = {};

  $.each($('#employeeForm').serializeArray(), function(i, field){
    employeeValues[field.name] = field.value;
  });

  $('#employeeForm').find('input[type=text]').val('');

  employeeArray.push(employeeValues);

  sendDataToServer(employeeValues);
};


function aggregateSalaryCalculator(arrayOfEmployees) {
  var totalSalary = 0
  for (var i = 0; i < arrayOfEmployees.length; i++) {
    totalSalary += parseInt(arrayOfEmployees[i].salary);
  }
  $('.aggregate-salary').html('<h1>' + "aggregate employee salaries:" + totalSalary + '</h1>');
}

function deleteEmployee() {
  for (var k = 0; k < response.length; k++) {
    if (response[k].employeeID == $(this).data('idnum')) {
      response.splice(k, 1);
    };
  };
  $(this).parent().remove();
  aggregateSalaryCalculator(response);
  console.log("an employee was deleted, here is the current employee array:" , employeeArray);
}

function sendDataToServer(personData) {
  $.ajax({
    type: 'POST',
    url: '/person',
    data: personData,
    success: checkServer,
  });
}

function handleServerResponse(response) {
  console.log(response)
};

function checkServer(){
  $.ajax({
    type: 'GET',
    url: '/person',
    success: function(response) {
      response.forEach(function(employee) {
        $('.results-div').append('<ul class="employee"></ul>');
        var $lastUl = $(".results-div").children().last();
        $lastUl.append('<h2>' + employee.first_name + " " + employee.last_name + '</h2>');
        $lastUl.append('<li>' + employee.employeeid + '</li>');
        $lastUl.append('<li>' + employee.job_title + '</li>');
        $lastUl.append('<li>' + employee.salary + '</li>');
        $lastUl.append('<button class="toggle-active" data-idNum="' + employee.employeeid + '">ur fired</button>');
        aggregateSalaryCalculator(response);
      });
    }
  });
}
