import React, { Component } from 'react';
import './App.css';
import $ from 'jquery';

const exampleRecipes = [{"name": "Pumpkin Pie", "ingre": ["Pumpkin Puree", "Sweetened Condensed Milk", "Eggs", "Pumpkin Pie Spice", "Pie Crust"]},
                        {"name": "Spaghetti", "ingre": ["Noodles", "Tomato Sauce", "(Optional) Meatballs"]},
                        {"name": "Onion Pie", "ingre": ["Onion", "Pie Crust", "Sounds Yummy right?"]}];
var recipeList; var triggerDelete;


class FoodName extends Component {
  render() {
    return(<h3 onClick={this.props.onClick}>{this.props.name}</h3>);
  }
}

class Ingredients extends Component {
  render() {
    return(
        <p>{this.props.value}</p>
    );
  }
}

class IngredientsDiv extends Component {
  render() {
    return(
      <div className={this.props.className}>
        {this.props.value}
      </div>
    )
  }
}

class EditButton extends Component {
  render() {
    return(<button type="button" className={this.props.className} onClick={this.props.onClick}><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Edit</button>);
  }
}

class DeleteButton extends Component {
  render() {
    return(<button type="button" className={this.props.className} onClick={this.props.onClick}><i class="fa fa-trash" aria-hidden="true"></i> Delete</button>);
  }
}

class SaveButton extends Component {
  render() {
    return(<span onClick={this.props.onClick} class="save-btn">Save</span>);
  }
}

class CancelButton extends Component {
  render() {
    return(<span onClick={this.props.onClick} class="cancel-btn">Cancel</span>);
  }
}

class AddRecipe extends Component {
  render() {
    return(
      <div id="inputNewRecipe">
        <input type="text" placeholder="Title" id="inputTitle"/>
        <textarea type="text" placeholder="Ingredients (use comma to separate the ingredients)" id="inputIngredients"/>
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { triggerDelete: 0, newRecipe: false, modalBox: false, name: "", ingreString: "" };
    this.deleteRecipe = this.deleteRecipe.bind(this);
    this.editRecipe = this.editRecipe.bind(this);
    this.addRecipe = this.addRecipe.bind(this);
    this.cancel = this.cancel.bind(this);
    this.saveNewRecipe = this.saveNewRecipe.bind(this);
  }

  editRecipe(e) {
    let name = e.target.className.split("-").join(" ");
    name = name.slice(0, name.indexOf(" edit btn"));
    let ingre = localStorage.getItem(name);
    this.setState({modalBox:true, name: name, ingreString: ingre});
  }

  deleteRecipe(e) {
    localStorage.removeItem(e.target.className.split("-").join(" "));

    let listRemove = localStorage.getItem("storedRecipes").split(",");
    listRemove.splice(listRemove.indexOf(e.target.className.split("-").join(" ")),1);
    localStorage.setItem("storedRecipes", listRemove);

    this.setState({ triggerDelete: triggerDelete +1 });
  }

  addRecipe() {
    this.setState({ newRecipe: true });
  }

  saveNewRecipe() {
    if (this.state.newRecipe === true) {
      let newFood = $("#inputTitle").val();
      let newIngre = $("#inputIngredients").val().split(",");
      if (newFood !== "" && String(newIngre) !== "") {
        localStorage.setItem(newFood, newIngre);

        let beforeSave = localStorage.getItem("storedRecipes");
        let afterSave = beforeSave + "," + newFood;
        localStorage.setItem("storedRecipes", afterSave);

        this.setState({ newRecipe: false });
        }
      } else if (this.state.modalBox === true) {
        let newIngre = $("#input-modal-box").val();
        localStorage.setItem(this.state.name, newIngre);

        this.setState({modalBox: false});
      }
  }

  cancel() {
    this.setState({ newRecipe: false, modalBox: false });
  }

  toggleIngredients(e) {
    $("."+e.target.innerText.split(" ").join("-")).slideToggle("slow");
  }

  render() {

    recipeList = localStorage.getItem("storedRecipes");

    if (recipeList === null) {
      recipeList = [];
      for (var i in exampleRecipes) {
        localStorage.setItem(exampleRecipes[i].name, exampleRecipes[i].ingre);
        recipeList.push(exampleRecipes[i].name)
        localStorage.setItem("storedRecipes", recipeList);
      }
    } else {
        recipeList = localStorage.getItem("storedRecipes").split(",");
    }

    let ingredients = [];
    for (i in recipeList) {
      ingredients.push(localStorage.getItem(recipeList[i]).split(","));
    }

    let recipes = [];
    for (i in recipeList) {
      recipes.push(<FoodName name={recipeList[i]} onClick={this.toggleIngredients} />);

      let foodClassName = recipeList[i].split(" ").join("-");
      let list = [];
      for (var j in ingredients[i]) {
        list.push(<Ingredients value={ingredients[i][j]} />);
      }
      recipes.push(<IngredientsDiv className={foodClassName+" list"} value={list} />,<EditButton className={foodClassName+" edit-btn"} onClick={this.editRecipe}/>,<DeleteButton className={foodClassName+" delete-btn"} onClick={this.deleteRecipe}/>);
    }

    return (
      <div className="App">
        <h1>RECIPE BOX</h1>
        <div className="recipes">
          {recipes}
        </div>
        {this.state.newRecipe &&
          <div class="add-recipe-area">
            <AddRecipe />
            <div id="saveCancelBtn">
              <SaveButton onClick={this.saveNewRecipe}/>
              <CancelButton onClick={this.cancel}/>
            </div>
          </div>}
        {!this.state.newRecipe && <button type="button" id="addRecipeBtn" onClick={this.addRecipe}>Add New Recipe</button>}
        {this.state.modalBox &&
          <div id="edit-recipe-box">
            <div id="box-content">
              <p id="close" onClick={this.cancel}>&times;</p>
              <p class="edit-box-heading">Edit Recipe: {this.state.name}</p>
              <p>(Use comma to separate the ingredients.)</p>
              <textarea id="input-modal-box" defaultValue={this.state.ingreString} />
              <SaveButton id="savebtn-modal-box" onClick={this.saveNewRecipe}/>
            </div>
          </div>}
      </div>
    );
  }
}

export default App;
