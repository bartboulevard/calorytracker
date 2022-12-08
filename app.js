const StorageCtrl = (function(){
    return{
        storeItem:function(item){
            let items
            if(localStorage.getItem("items") === null){
                items = []
                items.push(item)
                localStorage.setItem("items", JSON.stringify(items))
            } else {
                items = JSON.parse(localStorage.getItem("items"))
                items.push(item)
                localStorage.setItem("items", JSON.stringify(items))
            }
        },
        getItemsFromLS:function(){
            let items;
            if(localStorage.getItem("items") === null){
                items = []
            } else {
                items = JSON.parse(localStorage.getItem("items"))
            }

            return items
        }(),
        changeItemFromLS: function(id, newItem){
            if(localStorage.getItem("items") === null){

            } else {
                let items;
                items = JSON.parse(localStorage.getItem("items"))
                items[id]=newItem
                localStorage.setItem("items", JSON.stringify(items))
            }
        },
        delItemFromLS: function(id){
            if(localStorage.getItem("items") === null){
            } else {
                let items;
                items = JSON.parse(localStorage.getItem("items"))
                items.splice(id,1)
                localStorage.setItem("items", JSON.stringify(items))
            }
        }
    }})();
const ItemCtrl = (function(){
    const Item = function(id,name,calories){
        this.id = id
        this.name = name
        this.calories = calories
    }

    const data = {
        items: [
            // {id:0, name:"Steak", calories: 1200},
            // {id:1, name:"Cookie", calories: 400},
            // {id:2, name:"eg", calories: 300}
        ],
        total: 0,
        currentItem: null
    }

    return{
        getItems: function(){
            return data.items
        },
        addItem: function(name, calories){
            let ID;
            if(data.items.length >0){
                ID = data.items[data.items.length-1].id + 1
                console.log(ID)
            } else{
                ID = 0
            }
            calories = parseInt(calories)
            newItem = new Item(ID,name, calories);
            data.items.push(newItem);
            return newItem
        },
        getTotalCalories: function(){
            let total = 0
            data.items.forEach(function(item){
                total = total + item.calories
                console.log(total)
            })
            data.total = total
            console.log(data.total)
            return data.total
        },
        logData: function(){
            return data
        },
        changeName: function(name){
            this.name = name
        },
        changeCalorie: function(calories){
            this.calories = calories
        }
    }
})();
const UICtrl = (function(){
    const UISelectors = {
        itemList: "#item-list",
        itemNameInput: "#item-name",
        itemCaloriesInput: "#item-calories",
        addBtn: ".add-btn",
        totalCalories: ".total-calories",
        updateBtn: ".update-btn",
        deleteBtn: ".delete-btn"
    }
    return {
        populateItemList: function(items){
            let html= "";

            items.forEach(
                function(item) {
                    html += `<li class="collection-item" id="item-${item.id}">
                    <strong>${item.name}:</strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>
                    </li>`;
                });
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getSelectors: function(){
            return UISelectors;
        },
        getItemInput: function(){
            return {
                name:document.querySelector(UISelectors.itemNameInput).value,
                calories:document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function(item){
            const li= document.createElement("li")
            li.className = "collection-item"
            li.id = `item-${item.id}`
            li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em> <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`
            document.querySelector(UISelectors.itemList).insertAdjacentElement("beforeend", li)
        },
        clearInput: function(){
            document.querySelector(UISelectors.itemNameInput).value = ""
            document.querySelector(UISelectors.itemCaloriesInput).value = ""
        },
        showTotalCalories: function(totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories
        },
        showupdateBtn: function (){
            document.querySelector(UISelectors.updateBtn).style.display= "block"
            document.querySelector(UISelectors.addBtn).style.display= "none"
        },
        hideupdateBtn: function (){
            document.querySelector(UISelectors.updateBtn).style.display= "none"
            document.querySelector(UISelectors.addBtn).style.display= "block"

        },
        showdeleteBtn: function (){
            document.querySelector(UISelectors.deleteBtn).style.display = "block"
            document.querySelector(UISelectors.addBtn).style.display = "none"
        },
        hidedeleteBtn: function (){
            document.querySelector(UISelectors.deleteBtn).style.display = "none"
            document.querySelector(UISelectors.addBtn).style.display = "block"
        }
    }
})();
const App = (function(ItemCtrl,StorageCtrl,UICtrl){
    const loadEventListeners = function(){
        const UISelectors = UICtrl.getSelectors()
        document.querySelector(UISelectors.addBtn).addEventListener("click", itemAddSubmit);
        document.querySelector("ul").addEventListener("click", itemMealUpdate);
        document.querySelector(UISelectors.updateBtn).addEventListener("click", mealUpdate);
        document.addEventListener("DOMContentLoaded", getItemsFromLS)
        document.querySelector("ul").addEventListener("click", itemMealDelete)
        document.querySelector(UISelectors.deleteBtn).addEventListener("click", mealDelete)
    }
    const itemAddSubmit = function(event) {
        const input = UICtrl.getItemInput()
        if (input.name !== '' && input.calories !== '') {
            const newItem = ItemCtrl.addItem(input.name, input.calories)
            console.log(newItem)
            UICtrl.addListItem(newItem)
            const totalCalories = ItemCtrl.getTotalCalories()
            UICtrl.showTotalCalories(totalCalories)
            StorageCtrl.storeItem(newItem)
            UICtrl.clearInput()
        }
        event.preventDefault()
    }
    const itemMealUpdate = function(event){
        const UISelectors = UICtrl.getSelectors()
        if(event.target.className === "edit-item fa fa-pencil"){
            if (document.querySelector(UISelectors.updateBtn).style.display === 'none'){
                UICtrl.showupdateBtn()
            } else {
                UICtrl.hideupdateBtn()
            }
            // StorageCtrl.storeItem(newItem)
            console.log(event.target.parentElement.parentElement)
            event.target.parentElement.parentElement.id = "item-update"
        }
    }
    const mealUpdate = function(){
        const input = UICtrl.getItemInput()
        const newItem = ItemCtrl.addItem(input.name, input.calories)
        if (input.name !== '' && input.calories !== '') {
            const list = document.querySelector("#item-list")
            var nodes = Array.from(list.children)
            newID = nodes.indexOf(document.querySelector("#item-update"))
            const updateItem =`<strong>${newItem.name}: </strong> <em>${newItem.calories} Calories</em> <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`
            document.querySelector("#item-update").innerHTML = updateItem
            document.querySelector("#item-update").id = `item-${newID}`
            newItem.id = newID
            StorageCtrl.changeItemFromLS(newID, newItem)
        }
    }
    const itemMealDelete = function (){
        const UISelectors = UICtrl.getSelectors()
        if (event.target.className === "edit-item fa fa-pencil"){
            if (document.querySelector(UISelectors.deleteBtn).style.display === "none"){
                UICtrl.showdeleteBtn()
            } else {
                UICtrl.hidedeleteBtn()
            }
        }
    }
    const mealDelete = function (){
        const list = document.querySelector("#item-list")
        const UISelectors = UICtrl.getSelectors()
        var nodes = Array.from(list.children)
        delID = nodes.indexOf(document.querySelector("#item-update"))
        StorageCtrl.delItemFromLS(delID)
        list.removeChild(list.children[delID])
    }
    const getItemsFromLS = function(){
        const items = StorageCtrl.getItemsFromLS
        items.forEach(function(item){
            ItemCtrl.addItem(item["name"], item["calories"])
        })
        const totalCalories = ItemCtrl.getTotalCalories()
        UICtrl.showTotalCalories(totalCalories)
        UICtrl.populateItemList(items)
    }
    return{
        init:function(){
            console.log("Initializing App")
            const items = ItemCtrl.getItems()
            UICtrl.populateItemList(items)
            loadEventListeners();
        }
    }

})(ItemCtrl,StorageCtrl, UICtrl)
App.init()