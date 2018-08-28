var TOKEN = '';
var USERINFO = {};
var SAVINGS = {};
var SAVED = '';
var URL = 'https://192.168.43.26:8000/'
// var URL =  'https://localhost:8000/';
var EXPENDITURE = [];
//Axios

var HTTP = axios.create({
    baseURL: URL,
})

var getSavings = ()=>{
    HTTP.get('savings',{
        headers: {
            'Authorization': 'Bearer '+ TOKEN
        }
    })
    .then((res)=>{
        SAVINGS = res.data.details;
        if(SAVINGS){
            SAVED = SAVINGS.savingsList[SAVINGS.savingsList.length-1].saved;
        }else{
            SAVED = ''
        }
    })
    .catch((err)=>{
        console.log(err);
    });
    return 0;
}
var updateSavings = (savings)=>{
    data = {saved:savings}
    HTTP.post('/savings',
        data
    ,{
        headers: {
            'Authorization': 'Bearer '+ TOKEN
        }
    })
    .then((res)=>{
        getSavings()
    })
    .catch((err)=>{
        console.log(err);
    });
    return 0;
}

var getExp = ()=>{
    HTTP.get('/exp',{
        headers: {
            'Authorization': 'Bearer '+ TOKEN
        }
    })
    .then((res)=>{
        EXPENDITURE = res.data.expList;
    })
    .catch((err)=>{
        console.log(err);
    });
    return 0;
}

//Communication b/w components
window.Event = new Vue();

// Components


//____________________________________________
//Home Page
home = {
    template:`
        <div class="w3-container" style="width:95vw;margin:auto;max-width:900px">
            <div class="w3-center" style="">
                <p style="font-family: 'Bangers', cursive;" class="w3-xxlarge">Hello {{user}} </p>
             </div>
             <div class="w3-card w3-center" style="width:95%; min-width:175px; padding:8px; margin:auto">
                <div class="w3-row">
                    <div class="w3-col l6 m8 s12">
                        <img :src="img" onerror="this.onerror=null; this.src='./assets/images/userPH.png';" ref="DP" class="w3-padding w3-circle" style="width:35vw; height:35vw; max-width:200px; min-width:150px; min-height:150px; max-height:200px;">
                    </div>
                    <div class="w3-col l6 m4 s12" style="height:100%">
                        <div style="margin: auto">
                            <h4>Budget Remaining</h4>
                            <h1 v-if="savings != ''">INR: {{savings}}</h1>
                            <p v-else>Update in settings</p>
                        </div>
                    </div>
                </div>
                <div class="w3-container" style="text-align:center">
                    <h4><b>About Me</b></h4>
                    <p>{{about}}</p>
                </div>
            </div>
        </div>
    `,
    
    data(){
        return {
            img : '',
            user:'',
            about: '',
            savings: SAVED
        }   
    },
    methods:{
        fetch(){
            var home = this;
            this.img = '';
            if(USERINFO){  
                home.user = USERINFO.username;
                if(home.user!=''&&home.user){
                    home.user = home.user.split("@")[0];
                } 
                if(!USERINFO.about||USERINFO.about==''){
                    home.about = 'To add description go to User Settings and add';
                }
                else{
                    home.about = USERINFO.about;
                }
            }
            if(this.img=='')
                this.img = URL+ 'images/' + USERINFO.username + '.PNG' + '?' + (Math.random()*100000000000000000);
        }
    },
    created(){
        this.fetch();
    }
}

//____________________________________________
//user
user = {
    template:`
        <div class="w3-center w3-margin" style="width:95vw;">
            <h2 class="w3-xxlarge" style="font-family: 'Bangers', cursive;">Settings</h2>
            <div class="w3-container" style="width:100%; max-width:900px; margin:auto;">
                <div class="w3-bar-block w3-center w3-padding">
                    <div :class="{'w3-container': true, 'w3-bar-item': true, 'w3-button': true, 'w3-border-bottom': true, 'w3-black': ud, 'w3-padding-32': !ud}" @click="showUd" style="width:100%">Update user description</div>
                    <div class="w3-container w3-center" style="margin-bottom:32px;" v-if="ud">
                        <p>Enter About You</p>
                        <textarea rows="4" style="width:100%" placeholder="Hey, I am ...." v-model="info"></textarea>
                        <button class="w3-btn" @click="update">Save Changes</button>
                    </div>
                    <div :class="{'w3-container': true, 'w3-bar-item': true, 'w3-button': true, 'w3-border-bottom': true, 'w3-black': pf, 'w3-padding-32': !pf}" @click="showPf" style="width:100%">Change profile picture</div>
                    <div class="w3-container w3-padding-32" v-if="pf">
                        <form @submit.prevent>
                            <div v-if="!image">
                                <label style="cursor:pointer" for="file">Select an image</label>
                                <input type="file" ref="file" @change="onFileChange" id="file" style="display:none">
                            </div>
                            <div v-else>
                                <img :src="image" class="w3-margin" style="width:100px; height:100px;"/><br/>
                                <button @click="removeImage" class="w3-button">Remove image</button><br/>
                                <button @click = "upload" class="w3-button">Change Profile Pic</button>
                            </div>
                        </form>
                    </div>
                    <div :class="{'w3-container': true, 'w3-bar-item': true, 'w3-button': true, 'w3-border-bottom': true, 'w3-black': us, 'w3-padding-32': !us}" @click="showUs" style="width:100%">Budget Of the week</div>
                    <div class="w3-row w3-padding-32" v-if="us">
                        <div class="w3-col l8 m12 s12">
                            <input placeholder="BUDGET OF THE WEEK" type="number" class="w3-input w3-animate-input" style="width:60%;max-width:90%;" v-model="SOTW" min="0">
                        </div>
                        <div class="w3-col l4 m12 s12">
                            <button class="w3-button w3-green w3-hover-green" style="width:100%" @click="submit" :disabled="SOTW==''||!SOTW">UPDATE</button>
                        </div>
                    </div>
                    <div class="w3-container w3-bar-item w3-button w3-border-bottom w3-padding-32" @click="logout()" style="width:100%">Logout</div>
                </div>
            </div>
        </div>
    `,
    data(){
        return {
            ud: false,
            pf: false,
            us : false,
            image: '',
            File :'',
            info : '',
            SOTW:''
        }
    },
    methods: {
        onFileChange(e) {
          var files = e.target.files || e.dataTransfer.files;
          if (!files.length)
            return;
          this.File = files[0];
          this.createImage(files[0]);
        },
        createImage(file) {
          var image = new Image();
          var reader = new FileReader();
          var vm = this;
    
          reader.onload = (e) => {
            vm.image = e.target.result;
          };
          reader.readAsDataURL(file);
        },
        removeImage: function (e) {
          this.image = '';
        },
        showUd(){
            this.pf = false;
            this.us = false;
            this.ud = !this.ud;
        },
        showPf(){
            this.ud = false;
            this.us = false;
            this.pf = !this.pf;
        },
        showUs(){
            this.ud = false;
            this.pf = false;
            this.us = !this.us;
        },   
        logout(){
            TOKEN = '';
            Event.$emit('logged-in');
            location.reload();
        },
        update(){
            HTTP.post('/users/update',
                {
                    about : this.info
                },{
                headers:{
                    Authorization: 'Bearer '+ TOKEN
                }
            })
            .then((res)=>{
                if(res.data.success){
                    USERINFO.about = this.info;     
                    router.push('/');
                }
            })
            .catch((err)=>{
                alert('Internal Server Error');
            })
        },
        upload(){
            var formData = new FormData();
            formData.append('imageFile', this.File);
            HTTP.post('/images',
                formData,{
                headers:{
                    Authorization: 'Bearer '+ TOKEN,
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then((res)=>{
                if(res.data.success){
                    router.push('/');
                }
            })
            .catch((err)=>{
                alert('Internal Server Error');
            });
        },
        submit(){
            updateSavings(this.SOTW);
            SAVED = this.SOTW;
            this.SOTW = '';
        }
      }
}

//
//expList
explist = {
    template:`
    <div class="w3-modal w3-show">
        <div class="w3-modal-content">
        <header class="w3-container w3-teal"> 
            <router-link class="w3-button w3-display-topright w3-hover-teal" to="/exp">X</router-link>
            <p>Expenditure List</p>
        </header>
        <div class="w3-container" v-if="show" style="overflow:auto">
            <table class="w3-table w3-bordered w3-large">  
                <tr>
                    <th>Item</th>
                    <th>Amount (INR)</th>
                </tr>
                <tr v-for="item in list" @click="display(item)" style="cursor:pointer">
                    <td>{{item.item}}</td>
                    <td>{{item.price}}</td>
                </tr>
            </table>
        </div>
        <div class="w3-container w3-center" v-else>
            <p class="xlarge">{{item}}</p>
            <p class="large">Cost: {{price}}</p>
            <p class="large">On {{ddmmyyyy}} at {{time}}</p>
            <img :src="imgUrl" class="w3-padding" style="width:80%;max-width:400px;height:auto;">
        </div>
        <div
        <footer class="w3-container w3-teal">
            <p class="w3-center">©ExM</p>
        </footer>
        </div>
    </div>
    `,
    data(){
        return {
            show : true,
            item : '',
            price: 0,
            imgUrl: '',
            ddmmyyy: '',
            time:'',
            list:[]
        }
    },
    methods:{
        datemonthyear(obj){
            var today = new Date(obj);
            var dd = today.getDate();
            var mm = today.getMonth()+1; //January is 0!

            var yyyy = today.getFullYear();
            if(dd<10){
                dd='0'+dd;
            } 
            if(mm<10){
                mm='0'+mm;
            } 
            var today = dd+'/'+mm+'/'+yyyy;
            return today;
        },
        display(listItem){
            this.item = listItem.item;
            this.price = listItem.price;
            var latlon = listItem.latitude+','+listItem.longitude;
            this.imgUrl = "https://maps.googleapis.com/maps/api/staticmap?center="+latlon+"&zoom=14&size=400x300&sensor=false&key=AIzaSyB6giMgmCBoc5zOgIJqzEqffcC7tFjpDGs";
            var dates = listItem.createdAt;
            var x = new Date(dates);
            var dd = x.getDate();
            var mm = x.getMonth()+1; //January is 0!
            var yyyy = x.getFullYear();
            if(dd<10){
                dd='0'+dd;
            } 
            if(mm<10){
                mm='0'+mm;
            } 
            this.ddmmyyyy = dd+'/'+mm+'/'+yyyy;            
            if(x.getHours()<10){
                this.time = ' 0'+x.getHours()+':';
            }
            else{
                this.time = x.getHours()+':';
            }

            if(x.getMinutes()<10){
                this.time += ' 0'+x.getMinutes();
            }
            else{
                this.time += x.getMinutes();
            }
            this.show = false;
        },
        close(){
            Event.$emit('close');
        }
    },
    created(){
        if(this.$route.params.date){
            this.list = EXPENDITURE.filter((el)=>{
                date1 = new Date(el.createdAt);
                date2 = new Date(this.$route.params.date);
                if(date1.getDate()==date2.getDate()&&date1.getMonth()==date2.getMonth()&&date1.getFullYear()==date2.getFullYear())
                    return true;
            })
        }
        else{
            this.list = EXPENDITURE;
        }
    }
}

//____________________________________________
//expenditure
exp = {
    template:`
    <div class="w3-container" style="width:95vw; max-width:900px;margin:auto">
        <div class="w3-container w3-center">
            <p class="w3-xxlarge" style="font-family: 'Bangers', cursive;">Expenditures..</p>
        </div>
        <div class="w3-panel w3-red" v-if="update">
            <p class="w3-large">Please update weekly savings from <b>User Settings</b></p>
        </div>
        <div class="W3-bar-block w3-container">
            <div class="w3-container w3-green" v-if="successful"><button class="w3-button w3-hover-green" style="width:100%;display:block!important" @click="successful = false">Added<span class="w3-right" @click="successful = false">X</span></button></div>
            <div v-if="!update" :class="{'w3-bar-item': true, 'w3-button': true, 'w3-border-bottom': true, 'w3-black': add, 'w3-padding-32': !add}" @click="toggleAdd" style="width:100%">Add Expenditure</div>
            <div class="w3-container" style="margin-bottom:20px" v-if="add">
                <input type="text" class="w3-input w3-animate-input" style="display:block;margin-top:20px" placeholder = "Item Details" v-model="Item">
                <input type="number" class="w3-input w3-animate-input" placeholder = "Price" v-model="Price"><br/>
                <label class="switch w3-small"><input type="checkbox" v-model="location"><span class="slider round"></span></label>
                <p class="w3-tiny" style="color:red">
                    To not include location please click on the slider
                </p>
                <button class="w3-button w3-green" style="width:100%" :disabled="addExpCheck" @click="addExp">Add</button>
                <p class="w3-small" style="color:red" v-if="priceProb">Budget Not enough. Change Budget in user settings.</p>
            </div>
            <router-link :class="{'w3-bar-item': true, 'w3-button': true, 'w3-border-bottom': true, 'w3-black': seh, 'w3-padding-32': !seh}" @click="toggleSeh" style="width:100%" to="/explist" list="list">Show Expenditure History</router-link>
            <div :class="{'w3-bar-item': true, 'w3-button': true, 'w3-border-bottom': true, 'w3-black': sehd, 'w3-padding-32': !sehd}" @click="toggleSehd" style="width:100%">Show Expenditure History By Date</div>    
            <div class="w3-container" v-if="sehd">
                <input class="w3-input w3-animate-input" type="date" v-model="d"><br/>
                <router-link class="w3-green w3-button" :to="'/explist/'+d">Get List</router-link>
            </div>
        </div>
    </div>
    `,
    data(){
        return {
            add:false,
            seh:false,
            sehd:false,
            location:true,
            Item:'',
            Price:'',
            longitude: '',
            latitude: '',
            successful: false,
            update: false,
            list: EXPENDITURE,
            d:''
        }
    },
    methods:{
        toggleAdd(){
            this.seh = false;
            this.sehd = false;
            this.add = !this.add;
        },
        toggleSeh(){
            this.seh = !this.seh;
            this.sehd = false;
            this.add = false;
        },
        toggleSehd(){
            this.seh = false;
            this.sehd = !this.sehd;
            this.add = false;
        },
        getLocation(){
            if(this.location){
                navigator.geolocation.getCurrentPosition((position)=>{
                    this.longitude = position.coords.longitude;
                    this.latitude = position.coords.latitude;
                    //alert(this.longitude+" + " + this.latitude);
                },(err)=>{
                    alert(err);
                },{
                    enableHighAccuracy: true
                         ,timeout : 5000
               })
            }
        },
        addExp(){
            var data = {
                item: this.Item,
                price: this.Price,
                longitude: this.longitude,
                latitude: this.latitude
            }
            HTTP.post('/exp',
            data,{
                headers: {
                    'Authorization': 'Bearer '+ TOKEN
                }
            })
            .then(res=>{
                this.successful = true;
                this.add = false;
                return getExp()
            })
            .then(()=>{
                return updateSavings(SAVED - this.Price);
            })
            .then(()=>{
                this.Item = '';
                this.Price = ''
            })
            .catch((err)=>{
                console.log(err);
            })

        },

    },
    computed:{
        addExpCheck(){
            if(this.Item==''||this.Price<=0||this.Price>SAVED){
                return true;
            }
            return false;
        },  
        priceProb(){
            if(parseInt(this.Price)>parseInt(SAVED)||!SAVED)
                return true;
            else
                return false;
        }
    },
    created(){
        if(SAVED==0||SAVED==''||!SAVED)
            this.update = true;
        var vm = this;
        this.getLocation();
    }
}

//____________________________________________
//savings
savings = {
    template:`
    <div class="w3-container" style="width:90vw; max-width:900px; margin:auto;">
        <div class="w3-container w3-center">
            <p class="w3-xxlarge" style="font-family: 'Bangers', cursive;">Your Savings</p>
        </div>
        <h1 class="w3-xxlarge" style="font-family: 'Kalam', cursive;" >Current Savings: {{savings}} </h1>
        <h1 class="w3-xxlarge" style="font-family: 'Kalam', cursive;" >Savings Amount Spent: {{boughtFromSavings}} </h1>
        <h1 class="w3-xxlarge" style="font-family: 'Kalam', cursive;" >Total Savings: {{boughtFromSavings + savings}} </h1>
        <div class="w3-container" style="width:100%; max-width:900px; margin:auto;">
            <div class="w3-bar-block w3-center w3-padding">
                <div :class="{'w3-container': true, 'w3-bar-item': true, 'w3-button': true, 'w3-border-bottom': true, 'w3-black': sh, 'w3-padding-32': !sh}" @click="showSH" style="width:100%">Show Savings History</div>
                <div class="w3-modal w3-show" v-if="sh">
                    <div class="w3-modal-content">
                    <header class="w3-container w3-teal"> 
                        <span @click="closeSH" class="w3-button w3-display-topright">&times;</span>
                        <h2>Savings History</h2>
                    </header>
                    <div class="w3-container">
                    <table class="w3-table w3-bordered w3-large">  
                        <tr>
                            <th>Week Number</th>
                            <th>Amount (INR)</th>
                         </tr>
                        <tr v-for="item in list">
                            <td>{{item.weekNo}}</td>
                            <td>{{item.saved}}</td>
                        </tr>
                    </table>
                    </div>
                    <footer class="w3-container w3-teal">
                        <p class="w3-tiny w3-center">Week number is from the day you started using the app <br/>In this list this weeks available amount will also be shown<br/>©ExM</p>
                    </footer>
                    </div>
                </div>
                <div :class="{'w3-container': true, 'w3-bar-item': true, 'w3-button': true, 'w3-border-bottom': true, 'w3-black': shw, 'w3-padding-32': !shw}" @click="showSHW" style="width:100%">Show Savings On Week</div>
                <div class="w3-container" v-if="shw" style="font-family: 'Kalam', cursive;">
                    <input type="number" class="w3-input w3-animate-input" placeholder="Input Week Number" min="1" v-model="weekNo" @keyup="displaySaved" style="margin-top:20px;">
                    <p class="w3-xlarge w3-center">Saved Amount: 
                        <span v-if="shwItem.saved"><br/>{{shwItem.saved}}</span>
                        <span v-else class="w3-small"><br/>Week Does Not Exist</span>    
                    </p>
                </div>
            </div>
        </div>
    </div>
    `,
    data(){
        return{
            savings:SAVINGS.savings,
            boughtFromSavings:SAVINGS.boughtFromSavings,
            sh : false,
            shw : false,
            list : SAVINGS.savingsList,
            weekNo : '',
            shwItem : {}
        }
    },
    methods:{
        showSH(){
            this.shw = false;
            this.sh = true;
        },
        closeSH(){
            this.sh = false;
        },
        showSHW(){
            this.sh = false;
            this.shw = !this.shw;
        },
        displaySaved(){
            var Array = this.list.filter(element => {
                if(element.weekNo == this.weekNo){
                    this.shwItem = element;
                    return true;
                }
            });
            if(!Array.length){
                this.shwItem = {}
            }
        }
    },
    created(){
        var app = this;
        HTTP.get('/savings',{
            headers: {
                'Authorization': 'Bearer '+ TOKEN
            }
        })
        .then((res)=>{
            SAVINGS = res.data.details;
            if(SAVINGS){
                SAVED = SAVINGS.savingsList[SAVINGS.savingsList.length-1].saved;
                console.log(SAVINGS.savings);
                app.savings = SAVINGS.savings;
                app.boughtFromSavings = SAVINGS.boughtFromSavings;
                app.list = SAVINGS.savingsList;
            }else{
                SAVED = ''
            }
        })
        .catch(err=>{
            throw err;
        })
    }
} 



//____________________________________________
//toDo
toDo = {
    template:`
    <div class="w3-container" style="width:90vw; max-width:800px; margin:auto;">
        <div class="w3-container w3-center">
            <p class="w3-xxlarge" style="font-family: 'Bangers', cursive;">To-Do List</p>
        </div>
        <div class="w3-row w3-center" style="background-color:mintcream; margin-bottom:32px">
            <div class="w3-col l10 m8 s8 w3-padding">
                <input class="w3-input w3-center" type="text" placeholder="Enter To Do" v-model="toDo" maxlength="20">
            </div>
            <div class="w3-col l2 m4 s4 w3-center">
                <button
                    class="w3-button w3-green w3-circle w3-hover-shadow"
                    :disabled="!toDo||!time"
                    @click="addToDo">
                    <span class="w3-large">+</span>
                </button>
            </div>
        </div>  
        <div class="w3-row w3-center" style="background-color:mintcream; margin-bottom:32px">
            <div class="w3-col l12 m12 s12">
                <input class="w3-input w3-center" type="datetime-local" placeholder="Enter Time" v-model="time">
            </div>
        </div> 
        <div class="w3-container w3-center">
            <div :class="{'w3-row':true, 'w3-center':true,'w3-aqua':!(i%2), 'w3-sand':i%2 }" v-for="(item,i) in items">
                <div class="w3-col l10 m8 s8 w3-padding">{{item.item}}</div>
                <div class="w3-col l2 m4 s4 w3-center"><button :class="{'w3-button':true,'w3-hover-aqua':!(i%2), 'w3-hover-sand':i%2 }" @click="deleteItems(item)">X</button></div>
            </div>
        </div>
    </div>
    `,
    data(){
        return {
            toDo : '',
            time:'',
            itemPrice : 0,
            items : []
        }
    },
    methods:{
        getItems(){
            HTTP.get('/toDO',{
                headers: {
                    Authorization: 'Bearer '+ TOKEN
                }
            })
            .then((res)=>{
                this.items = res.data.items;
            })
            .catch((err)=>{
                console.log(err);
            })
        },
        filterItems(item){
            this.items = this.items.filter(function(el) {
                return el._id !== item._id;
            });
        },
        deleteItems(item){
            var data = {id: item._id}
            HTTP.post('/toDo/delete',
            data,{
                headers: {
                    'Authorization': 'Bearer '+ TOKEN
                }
            })
            .then(()=>{
                this.filterItems(item);
            })
            .catch(err=>{
                console.log(err);
            })
        },
        addToDo(){
            var data = {item: this.toDo, date: this.time};
            HTTP.post('/toDo',
            data,{
                headers: {
                    'Authorization': 'Bearer '+ TOKEN
                }
            }).then(()=>{
                this.toDo = ''; 
                this.time = '';              
                this.getItems();
            })
            .catch(err=>{
                console.log(err);
            })
        }
    },
    created(){
        this.getItems();
    }
}



//____________________________________________
//toBuy
toBuy = {
    template:`
    <div class="w3-container" style="width:90vw; max-width:800px; margin:auto;">
        <div class="w3-container w3-center">
            <p class="w3-xxlarge" style="font-family: 'Bangers', cursive;">To-Buy List</p>
        </div>
        <div class="w3-row w3-center" style="background-color:mintcream">
            <div class="w3-col l5 m12 s12 w3-padding">
                <input class="w3-input w3-center" type="text" placeholder="New item Name" v-model="itemName">
            </div>
            <div class="w3-col l5 m12 s12 w3-padding">
                <input class="w3-input w3-center" type="number" placeholder="Item Price" v-model="itemPrice" min=1>
            </div>

            <div class="w3-col l2 m12 s12 w3-center">
                <button
                    class="w3-button w3-green w3-circle w3-hover-shadow"
                    :disabled="!itemName||(itemPrice<=0)"
                    @click="addItems">
                    <span class="w3-large">+</span>
                </button>
            </div>
        </div>  
        <div class="w3-container w3-center">
            <div class="w3-row w3-margin w3-center">
                <div class="w3-col l4 m6 s6 w3-xlarge"><b>Name</b></div>
                <div class="w3-col l4 m6 s6 w3-xlarge"><b>Price(RS)</b></div>
                <div class="w3-col l4 w3-hide-medium w3-hide-small w3-xlarge"><b>Options</b></div>
            </div>
            <div class="w3-row w3-center" v-for="(item,i) in items">
                <div class="w3-col l4 m6 s6 w3-padding">{{item.item}}</div>
                <div class="w3-col l4 m6 s6 w3-padding">{{item.price}}</div>
                <div class="w3-col l4 m12 s12" style="margin-bottom:16px">
                    <div class="w3-row">
                        <div class="w3-col l6 m6 s6 w3-center"><button class="w3-button" @click="deleteItems(item)">X</button></div>
                        <div class="w3-col l6 m6 s6 w3-center"><button class="w3-button" :disabled="item.price>savings" @click="updateItem(item,i)" v-if="!item.purchased">Buy</button>
                        <span class="w3-green w3-padding" v-else >Purchased</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    data(){
        return {
            itemName : '',
            itemPrice : '',
            savings:SAVINGS.savings,
            items : []
        }
    },
    methods:{
        getItems(){
            HTTP.get('/toBuy',{
                headers: {
                    Authorization: 'Bearer '+ TOKEN
                }
            })
            .then((res)=>{
                this.items = res.data.List;
            })
            .catch((err)=>{
                console.log(err);
            })
        },
        filterItems(item){
            this.items = this.items.filter(function(el) {
                return el._id !== item._id;
            });
        },
        deleteItems(item){
            var data = {id: item._id}
            HTTP.post('/toBuy/delete',
            data,{
                headers: {
                    'Authorization': 'Bearer '+ TOKEN
                }
            })
            .then(()=>{
                this.filterItems(item);
            })
            .catch(err=>{
                console.log(err);
            })
        },
        addItems(){
            var data = {item: this.itemName, price: this.itemPrice};
            HTTP.post('/toBuy',
            data,{
                headers: {
                    'Authorization': 'Bearer '+ TOKEN
                }
            }).then(()=>{
                this.itemName = '';
                this.itemPrice = '';                
                this.getItems();
            })
            .catch(err=>{
                console.log(err);
            })
        },
        updateItem(item,i){
            var data = {id: item._id}
            HTTP.post('/toBuy/update',
            data,{
                headers: {
                    'Authorization': 'Bearer '+ TOKEN
                }
            })
            .then(()=>{
                this.items[i].purchased = true;
            })
            .catch(err=>{
                console.log(err);
            })

            data = {bought:item.price}
            HTTP.post('/savings/bought',
            data,{
                headers: {
                    'Authorization': 'Bearer '+ TOKEN
                }
            })
            .then((res)=>{
                if(res.data.Success)
                    return
            })
            .catch(err=>{
                throw err;
            })
        }
    },
    created(){
        this.getItems();
    }
}



//____________________________________________
//feedback
feedback = {
    template:`
        <div style="margin:auto!important">
            <div class="w3-panel w3-center">
                <h2 class="w3-xxlarge" style="font-family: 'Bangers', cursive;">Your Review</h2>
                <form style="margin:20px;" @submit.prevent="">
                    <label class="w3-padding"><i>Ratings</i><br/></label>
                    <span v-for="(star,index) in STARS" :class="{'checked': star.state,'w3-xxlarge': true}" @mouseover="check(index)"><i class="fa fa-star"></i></span>
                    <br/><label class="w3-padding" style="display:block; margin-top:24px"><i>Review/Comments</i><br/></label>
                    <textarea v-model="review" rows="4" style="width:100%; max-width:700px;" maxlength="500" @blur="validateReview" placeholder="Share your experience / Review the app / Bug report / Comments within a 500 characters ...."></textarea>
                    <p class="w3-tiny" style="color:red" v-if="checkReview">Please fill a few words</p>
                    <h2 class="w3-large">Review/ Comment Preview </h2>
                    <p class="w3-xlarge" style="min-height:140px;line-height: 0.80em;word-break:break-word;font-family:'Nanum Pen Script', cursive;">{{review}}</p>
                    <button class="w3-button w3-green w3-hover-green" @click="formSubmit">Submit</button>
                </form>
            </div>
        </div>
    `, 
    data(){
        return{
            stars: 1,
            STARS:[{state:true},{state:false},{state:false},{state:false},{state:false}],
            msg: '',
            review:'',
            checkReview : false
        }
    },
    methods:{
        check(k){
            this.stars = k+1;
            for(var i=0; i<this.STARS.length; i++){
                if(i<=k){
                    this.STARS[i].state = true;
                }
                else{
                    this.STARS[i].state = false;
                }
            }            
        },
        validateReview(){
            this.review = this.review.trim();
            if(this.review!=''){
                this.checkReview = false;
            }
            else{
                this.checkReview = true;
            }
        },
        formSubmit(){
            this.validateReview();
            if(this.checkReview==false){
                HTTP.post('/review',{
                    ratings :this.stars,
                    review:this.review
                },
                {
                    headers: {
                        Authorization: 'Bearer '+ TOKEN
                    }
                })
                .then((res)=>{
                    if(res.data.err){
                        alert('Internal Error or redubmit');
                        this.checkReview = true;
                    }
                    else{
                        alert('Successfully Recorded The Feedback');
                        router.push('/');
                    }
                })                
            }
        }
    }
}

//______________________________________________________________________________________________________________
//Login Page
Vue.component('signup',{
    template:`
    <div class="w3-modal w3-show w3-display-container">
        <div class="w3-modal-content w3-display-container" style="margin:auto;">
        <span class="w3-button w3-display-topright w3-hover-white" @click="closeModal">X</span>
        <form class="w3-container w3-padding" @submit.prevent="">
            <div class="w3-section">
                <label><b>Email</b></label>
                <input class="w3-input w3-border" type="string" placeholder="Enter Email" v-model="email" @blur="validateEmail">
                <div class="w3-panel w3-red w3-display-container w3-center" v-if="exists">
                    <button class="w3-display-topright w3-button w3-hover-red" @click="closeNoti">X</button>
                    <p class="w3-margin-bottom">Email already exists </p>
                </div>
                <p class="w3-tiny  w3-margin-bottom" style="color:red" v-if="err.email">Invalid email id</p>
                <label class="w3-margin-top" style="display:block"><b>Password</b></label>
                <p class="w3-small">Password must contain atleast 1 number, 1 letter and must be atleast 8 characters in length</p>  
                <input class="w3-input w3-border" type="password" placeholder="Enter Password" v-model="password" @blur="validatePassword">
                <input class="w3-input w3-border w3-margin-top" type="password" placeholder="Confirm Password" v-model="re_password" @blur="validatePassword">
                <p class="w3-tiny  w3-margin-bottom" style="color:red" v-if="err.pw">Invalid password or Passwords don't match</p>
                <button class="w3-button w3-block w3-green w3-section w3-padding" @click="register">Register</button>
                <div class="w3-panel w3-center">
                    <h3 class="w3-medium">Info!!</h3>
                    <p class="w3-small">Once you register you will be redirected to login page. Please login then.</p>
                </div>
            </div>
        </form>
        </div>
    </div>
    `,
    methods:{
        closeModal(){
            Event.$emit('close-modal');
        },
        validateEmail() {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if(!re.test(this.email)){
                this.err.email = true;
            }
            else{
                this.err.email = false; 
            }
        },
        validatePassword(){
            var re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
            if(!re.test(this.password)||this.password!==this.re_password||this.err.pw.length<8){
                this.err.pw = true;
            }
            else{   
                this.err.pw = false; 
            }
        },
        register(){
            this.validateEmail();
            this.validatePassword();
            if(this.err.email||this.err.pw){
                return;
            }
            HTTP.post('/users/signup',{
                username: this.email,
                password: this.password
            }).then((res)=>{
                if(!res.data.err){
                    Event.$emit('close-modal',"Please Login");
                }
            }).catch((err)=>{
                this.exists = true;
                return false;
            })
        },
        closeNoti(){
            this.exists = false;
        }
    },
    data(){
        return {
            email : '',
            password: '',
            re_password: '',
            err:{
                email:false,
                pw:false
            },
            exists: false
        }
    },
})

Vue.component('login',{
    template:`
    <div class="w3-container w3-center" style="min-height:400px; margin-top:32px!important;">
        <signup v-if="register"></signup>
        <div class="w3-panel w3-center w3-margin-top">
            <img :src="img" onerror="this.onerror=null; this.src='/assets/images/userPH.png';"  width="120px" height="120px" class="w3-circle w3-margin">
            <div class="w3-container" style="max-width:500px;margin:auto;">
                <div class="w3-cell-row w3-border-bottom">
                    <div class="w3-cell w3-cell-middle"><input type="text" placeholder="Email" class="w3-padding w3-input w3-border-0" @blur="validateEmail" v-model="email" style="width:100%"></div>
                </div>
                <div class="w3-cell-row w3-border-bottom w3-margin-top">
                    <div class="w3-cell w3-cell-middle"><input type="password" placeholder="Password" class="w3-padding w3-input w3-border-0" v-model="pw" style="width:100%"></div>
                </div>
                <div>
                    <p style="color:red" class="w3-tiny" v-if="error">Invalid Email or Password</p>
                </div>
                <div class="w3-panel">
                    <button class="w3-button w3-blue w3-hover-blue" @click="signIn">Sign in</button>
                </div>
                <div class="w3-panel w3-tiny">
                    Not Registered? <a href="#" @click="registerUser">Sign Up</a>
                </div>
                <div class="w3-panel">
                    Or sign in with <i class="fa fa-facebook-official w3-xxlarge w3-button" aria-hidden="true" @click="fb"></i>
                </div>
            </div>
        </div>
    </div>
    `,
    data(){
        return {
            img: URL +'images/',
            error:false,
            register: false,
            email:'',
            pw:''   
        }
    },
    methods:{
        registerUser(){
            this.register = true;
        },
        validateEmail() {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if(!re.test(this.email)){
                this.error = true;
                this.img = URL + 'images/';
            }
            else{
                this.error = false;
                if(this.img==URL+'images/'){
                    this.img = this.img + (this.email+'.PNG');
                }
            }
        },
        signIn(){
            this.validateEmail();
            if(this.error){
                alert('Enter valid email');
                return;
            }
            HTTP.post('/users/login',{
                username: this.email,
                password: this.pw
            })
            .then((res)=>{
                TOKEN = res.data.token; 
            })
            .then(()=>{
                return HTTP.get('/users',{
                    headers: {
                        'Authorization': 'Bearer '+ TOKEN
                    }
                })
            })
            .then((res)=>{
                USERINFO = res.data;    
                return HTTP.get('/savings',{
                    headers: {
                        'Authorization': 'Bearer '+ TOKEN
                    }
                })
            })
            .then((res)=>{
                SAVINGS = res.data.details;
                if(SAVINGS){
                    SAVED = SAVINGS.savingsList[SAVINGS.savingsList.length-1].saved;
                }else{
                    SAVED = ''
                }
                return HTTP.get('/exp',{
                    headers: {
                        'Authorization': 'Bearer '+ TOKEN
                    }
                })
            })
            .then((res)=>{
                EXPENDITURE = res.data.expList;
                Event.$emit('logged-in');
            })
            .catch((err)=>{
                this.error = true;
            }) 
        },
        fb(){
            var app = this;
            var l =location;
            console.log('asdkasd');
            window.fbAsyncInit = function() {
                FB.init({
                    appId            : '2029768060616026',
                    autoLogAppEvents : true,
                    xfbml            : true,
                    version          : 'v2.12'
                });
                FB.getLoginStatus(function(response) {
                    if (response.status === 'connected') {
                        console.log('Logged in.');
                        var url = '/me?fields=name,email';
                        FB.api(url, function (response) {
                            console.log(response.name);
                            console.log(response.email);
                        });
                    }
                else {
                    FB.login(function (response) {
                            if (response.session) {
                                var url = '/me?fields=name,email';
                                    FB.api(url, function (response) {
                                });
                            }
                            else {
                                alert("Login and retry!");
                                setInterval(()=>{
                                    location.reload();
                                },2000);
                            }
                        }, { scope: 'email' });
                    }

                    HTTP.get('/users/facebook/token',{
                        headers: {
                            'Authorization': 'Bearer '+ response.authResponse.accessToken
                        }
                    })
                    .then((res)=>{
                        TOKEN = res.data.token; 
                    })
                    .then(()=>{
                        return HTTP.get('/users',{
                            headers: {
                                'Authorization': 'Bearer '+ TOKEN
                            }
                        })
                    })
                    .then((res)=>{
                        USERINFO = res.data;    
                        return HTTP.get('/savings',{
                            headers: {
                                'Authorization': 'Bearer '+ TOKEN
                            }
                        })
                    })
                    .then((res)=>{
                        SAVINGS = res.data.details;
                        if(SAVINGS){
                            SAVED = SAVINGS.savingsList[SAVINGS.savingsList.length-1].saved;
                        }else{
                            SAVED = ''
                        }
                        return HTTP.get('/exp',{
                            headers: {
                                'Authorization': 'Bearer '+ TOKEN
                            }
                        })
                    })
                    .then((res)=>{
                        EXPENDITURE = res.data.expList;
                        Event.$emit('logged-in');
                    })
                    .catch((err)=>{
                        this.error = true;
                    })

                    console.log(response);
                });
            };
          
            (function(d, s, id){
               var js, fjs = d.getElementsByTagName(s)[0];
               if (d.getElementById(id)) {return;}
               js = d.createElement(s); js.id = id;
               js.src = "https://connect.facebook.net/en_US/sdk.js";
               fjs.parentNode.insertBefore(js, fjs);
             }(document, 'script', 'facebook-jssdk'));
        }
    },
    created(){
        var thisComponent = this;
        Event.$on("close-modal",(msg)=>{
            thisComponent.register = false;
            if(msg){
                alert(msg);
            }
        });
    }
})

//___________________________________________________________________
setInterval
//ROUTER

var router = new VueRouter({
    routes:
        [
            {path:'/', component:home},
            {path:'/user', component:user},
            {path:'/exp', component:exp},   
            {path:'/explist', component:explist},
            {path:'/explist/:date', component:explist},
            {path:'/savings', component:savings},
            {path:'/toDo', component:toDo},
            {path:'/toBuy', component:toBuy},
            {path:'/feedback', component:feedback}
        ]
})
//

new Vue({
    router: router,
    el:"#main",
    data:{
        login: true,
        showNav: false
    },  
    created(){
        var app = this;
        if(TOKEN==''){
            this.login = true;
        }
        else{
            this.login = false;
        }
        Event.$on('logged-in',()=>{
            if(TOKEN==''){
                app.login = true;
            }
            else{
                app.login = false;
                router.push('/');
            }            
        });
    },
    methods:{
        showMenu(){
            this.showNav=true;
        },
        closeMenu(){
            this.showNav = false;
        },
    }
}).$mount("#main");

//2029768060616026|SrfejGaE1iQKkZWR5jnUJUBgjJQ