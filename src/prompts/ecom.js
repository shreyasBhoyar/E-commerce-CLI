const inquirer = require("inquirer");
const auto = require("inquirer-autocomplete-prompt");
const fuzzy = require("fuzzy");

inquirer.registerPrompt("loop", require("inquirer-loop")(inquirer));
// inquirer.registerPrompt("table", require("inquirer-table-prompt"));
inquirer.registerPrompt("autocomplete", auto);

const validateNumbers = moreValidationChecks => ({
  validate: input => {
      if (input === '') {
          return 'Please provide a valid number greater then 0'
      }
      return moreValidationChecks ? moreValidationChecks(input) : true
  },
  filter: input => {
      // clear the invalid input
      return Number.isNaN(input) || Number(input) <= 0 ? '' : Number(input)
  },
})

const getData = async(url)=> {
  // Storing response
  const response = await fetch(url);

  // Storing data in form of JSON
  var data = await response.json();
  return data.data.map((i) => {
    return {
      title: i.title,
      price: i.price,
    };
  });
}

const createInquirer = (prods) => {
  let prodTitle = prods.map((i) => i.title);

  const searchProds=(answers, input = "")=> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(fuzzy.filter(input, prodTitle).map((el) => el.original));
      }, Math.random() * 470 + 30);
    });
  }
  const questionList = [
    {
      type: "autocomplete",
      name: "product",
      suggestOnly: false, //if true, need to tab to complete and then enter
      message: "Which product do you want to buy?",
      searchText: "Searching...",
      emptyText: "Nothing found!",
      source: searchProds,
      loop: true,
      pageSize: 10,
      validate(val) {
  return val?true : "try again"
      },
    },
    {
      type: "input",
      name: "Quantity",
      message: "Quantity",
      default : 1,
      askAnswered : true,
      validate: (answer) => {
        if (isNaN(answer) || Number(answer)<=0) {
          return "Please enter a number greater than 0";
        }
        return true;
      },
    },
  ];

  const QuestionLoop = {
    type: "loop",
    name: "items",
    default: true,
    message: "Continue Shopping ?",
    questions: questionList,
  };


  inquirer
    .prompt({
      type: "input",
      name: "username",
      message: "Enter name",
      validate(val) {
        return val!=="" 
      },
    })
    .then((user) => {
      console.log(`Welcome ${user.username}`);
      inquirer.prompt(questionList).then(firstItem=>{


      inquirer.prompt(QuestionLoop).then((itemLoops) => {
        inquirer
          .prompt({
            type: "confirm",
            name: "viewCart",
            message: "Do you wanna view your cart",
          })
          .then((res) => {
            let total = 0;
            let cart= {}
            cart[firstItem.product] = parseInt(firstItem.Quantity)
            if (res.viewCart) {
              itemLoops.items.map((item) => {
                if(Object.keys(cart).includes(item.product)){
                  cart[item.product] +=parseInt(item.Quantity)
                }else{
                  cart[item.product] =parseInt(item.Quantity)
                }
                // total += parseInt(result.price) * item.Quantity;
              });
              Object.keys(cart).forEach((product)=>{
                let result = prods.find((p) => p.title === product);
                total += parseInt(result.price) *cart[product];
                                console.log(
                  `${product} : Rs. ${result.price} X ${cart[product]} `
                );
              })
              // console.log(cart)
              console.log("=========================");
              console.log(`Total is : ${total}`);
            }
          });
      });
    });
  })
};

module.exports = { createInquirer, getData };
