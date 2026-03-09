const SERVICES=["HCK","ADE","OK1","OK2","OK4"]
const DAYS=["Ma","Di","Wo","Do","Vr"]

const BLOCKS=26
const STORAGE="ok_planner_v2"

let state={
tab:"week",
block:1,
week:1,
employees:[],
skills:{},
rotation:[],
vacations:[],
notes:{}
}

const defaultEmployees=[
"Gordon","Lyon","Elena","Murphy","Jelle","Roy","Jerico","Grada","Joelle"
]

function init(){

defaultEmployees.forEach(n=>{

state.employees.push({
name:n,
role:(n==="Grada"||n==="Joelle")?"IC":"OK",
off:""
})

state.skills[n]={}

SERVICES.forEach(s=>{
state.skills[n][s]="Geel"
})

})

createRotation()
}

function createRotation(){

state.rotation=[]

let start=new Date("2026-01-05")

for(let b=1;b<=BLOCKS;b++){

let blockStart=new Date(start)
blockStart.setDate(start.getDate()+((b-1)*14))

for(let w=1;w<=2;w++){

let weekStart=new Date(blockStart)
weekStart.setDate(blockStart.getDate()+((w-1)*7))

let weekEnd=new Date(weekStart)
weekEnd.setDate(weekStart.getDate()+4)

state.rotation.push({

block:b,
week:w,
start:iso(weekStart),
end:iso(weekEnd),

HCK:"",
ADE:"",
OK1:"",
OK2:"",
OK4:"",
flex1:"",
flex2:""

})

}

}

}

function iso(d){

let y=d.getFullYear()
let m=("0"+(d.getMonth()+1)).slice(-2)
let day=("0"+d.getDate()).slice(-2)

return `${y}-${m}-${day}`

}

function format(d){

let dt=new Date(d)

let day=("0"+dt.getDate()).slice(-2)
let m=("0"+(dt.getMonth()+1)).slice(-2)

return `${day}/${m}/${dt.getFullYear()}`

}

function generateRoster(){

state.rotation.forEach(r=>{

let used=[]

SERVICES.forEach(s=>{

let candidates=state.employees.filter(e=>{

if(e.role==="IC" && s!=="OK1") return false

let skill=state.skills[e.name][s]

return skill==="Groen"||skill==="Oranje"

})

if(candidates.length===0) return

let pick=candidates[Math.floor(Math.random()*candidates.length)]

r[s]=pick.name

used.push(pick.name)

})

let flex=state.employees.filter(e=>!used.includes(e.name))

if(flex[0]) r.flex1=flex[0].name
if(flex[1]) r.flex2=flex[1].name

})

render()
}

function setTab(t){

state.tab=t
render()

}

function render(){

if(state.tab==="week") renderWeek()
if(state.tab==="rotation") renderRotation()
if(state.tab==="employees") renderEmployees()
if(state.tab==="skills") renderSkills()
if(state.tab==="vacation") renderVacation()
if(state.tab==="dashboard") renderDashboard()
if(state.tab==="notes") renderNotes()
if(state.tab==="help") renderHelp()

renderBlockSelector()
}

function renderBlockSelector(){

let select=document.getElementById("blockSelect")

select.innerHTML=""

for(let i=1;i<=BLOCKS;i++){

let o=document.createElement("option")
o.value=i
o.text="Blok "+i

if(i==state.block) o.selected=true

select.appendChild(o)

}

select.onchange=e=>{
state.block=parseInt(e.target.value)
render()
}

}

function currentRow(){

return state.rotation.find(r=>r.block==state.block && r.week==state.week)

}

function renderWeek(){

let r=currentRow()

let html="<h2>Weekplanning</h2>"

html+="<table><tr><th>Dag</th><th>Datum</th>"

SERVICES.forEach(s=>html+="<th>"+s+"</th>")

html+="<th>Flex1</th><th>Flex2</th></tr>"

DAYS.forEach((d,i)=>{

let date=new Date(r.start)
date.setDate(date.getDate()+i)

html+="<tr>"
html+="<td>"+d+"</td>"
html+="<td>"+format(date)+"</td>"

SERVICES.forEach(s=>{

html+="<td>"+(r[s]||"-")+"</td>"

})

html+="<td>"+(r.flex1||"-")+"</td>"
html+="<td>"+(r.flex2||"-")+"</td>"

html+="</tr>"

})

html+="</table>"

app.innerHTML=html

}

function renderRotation(){

let html="<h2>Roulatie</h2><table>"

html+="<tr><th>Blok</th><th>Week</th><th>Van</th><th>Tot</th>"

SERVICES.forEach(s=>html+="<th>"+s+"</th>")

html+="<th>Flex1</th><th>Flex2</th></tr>"

state.rotation.forEach(r=>{

html+="<tr>"
html+="<td>"+r.block+"</td>"
html+="<td>"+r.week+"</td>"
html+="<td>"+format(r.start)+"</td>"
html+="<td>"+format(r.end)+"</td>"

SERVICES.forEach(s=>html+="<td>"+(r[s]||"")+"</td>")

html+="<td>"+(r.flex1||"")+"</td>"
html+="<td>"+(r.flex2||"")+"</td>"

html+="</tr>"

})

html+="</table>"

app.innerHTML=html

}

function renderEmployees(){

let html="<h2>Medewerkers</h2>"

html+="<table><tr><th>Naam</th><th>Rol</th></tr>"

state.employees.forEach(e=>{

html+="<tr>"
html+="<td>"+e.name+"</td>"
html+="<td>"+e.role+"</td>"
html+="</tr>"

})

html+="</table>"

app.innerHTML=html

}

function renderSkills(){

let html="<h2>Competenties</h2><table>"

html+="<tr><th>Naam</th>"

SERVICES.forEach(s=>html+="<th>"+s+"</th>")

html+="</tr>"

state.employees.forEach(e=>{

html+="<tr><td>"+e.name+"</td>"

SERVICES.forEach(s=>{

html+="<td>"+state.skills[e.name][s]+"</td>"

})

html+="</tr>"

})

html+="</table>"

app.innerHTML=html

}

function renderVacation(){

app.innerHTML="<h2>Vakanties</h2><p>Hier kun je vakantieperiodes toevoegen.</p>"

}

function renderDashboard(){

let counts={}

state.rotation.forEach(r=>{

SERVICES.forEach(s=>{

let n=r[s]

if(!n) return

counts[n]=(counts[n]||0)+1

})

})

let html="<h2>Diensten verdeling</h2><table>"

html+="<tr><th>Naam</th><th>Diensten</th></tr>"

Object.keys(counts).forEach(n=>{

html+="<tr><td>"+n+"</td><td>"+counts[n]+"</td></tr>"

})

html+="</table>"

app.innerHTML=html

}

function renderNotes(){

let html="<h2>Medewerkers info</h2>"

state.employees.forEach(e=>{

html+=`
<p><b>${e.name}</b><br>
<textarea style="width:100%" rows=2 onchange="saveNote('${e.name}',this.value)">
${state.notes[e.name]||""}
</textarea></p>
`

})

app.innerHTML=html

}

function saveNote(name,val){

state.notes[name]=val

}

function renderHelp(){

app.innerHTML=`
<h2>Instructies</h2>

<ol>

<li>Controleer medewerkers</li>
<li>Controleer competenties</li>
<li>Klik Genereer rooster</li>
<li>Controleer roulatie</li>
<li>Klik Opslaan</li>

</ol>

`
}

function savePlanner(){

localStorage.setItem(STORAGE,JSON.stringify(state))
alert("Opgeslagen")

}

function resetPlanner(){

localStorage.removeItem(STORAGE)
location.reload()

}

function exportCSV(){

let csv="blok,week,van,tot,HCK,ADE,OK1,OK2,OK4,flex1,flex2\n"

state.rotation.forEach(r=>{

csv+=`${r.block},${r.week},${r.start},${r.end},${r.HCK},${r.ADE},${r.OK1},${r.OK2},${r.OK4},${r.flex1},${r.flex2}\n`

})

let blob=new Blob([csv])

let a=document.createElement("a")
a.href=URL.createObjectURL(blob)
a.download="rooster.csv"
a.click()

}

function load(){

let data=localStorage.getItem(STORAGE)

if(data){

state=JSON.parse(data)

}else{

init()

}

render()

}

load()
