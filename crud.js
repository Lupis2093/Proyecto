import {
    getFirestore,collection,getDocs,onSnapshot,addDoc,deleteDoc,doc,getDoc,updateDoc
 } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js"

const db=getFirestore();
const coleccion=collection(db,"prendas");

let editStatus = false;
let id = "";

const onGetPrendas = (callback) => onSnapshot(coleccion, callback);


window.addEventListener("DOMContentLoaded", async (e) => {
    
    onGetPrendas((querySnapshot)=>{
        const divPrendas=document.querySelector("#lista");
        divPrendas.innerHTML = "";
        querySnapshot.forEach((doc) => {
            const prenda = doc.data();
            divPrendas.innerHTML += `
                    
                <tr>
                    <td>${prenda.mod}</td>
                    <td>${prenda.tropa}</td>
                    <td>${prenda.precio}</td>
                    <td>${prenda.color}</td>
                    <td><button class="btn btn-outline-warning btnEdit" data-bs-toggle="modal" data-bs-target="#editModal"   data-id="${doc.id}"><i class="bi bi-pencil-fill"></i></button></td>
                    <td><button class="btn btn-outline-primary btnQR" data-bs-toggle="modal" data-bs-target="#qrModal"  data-id="${doc.id}"><i class="bi bi-qr-code"></i></button></td>
                    <td><button class="btn btn-outline-danger btnDelete"  data-id="${doc.id}"><i class="bi bi-trash-fill"></i></button></td>
                </tr>
                `;
        });

        const btnQR=document.querySelectorAll(".btnQR");
btnQR.forEach((btn)=>{
    btn.addEventListener("click", async (e)=>{
      try{
      id=btn.dataset.id;
      console.log(id);
      const data=await getDoc(doc(db, "prendas", id));
      const prenda=data.data();
      const contQR=document.getElementById('contQR');
      contQR.innerHTML=""
      const QR=new QRCode(contQR);
      QR.makeCode(id);
      } catch (error){  
        console.log(error);
      }
    });
  });
 

        const btnDelete = document.querySelectorAll(".btnDelete");
        //console.log(btnsDelete);
        btnDelete.forEach((btn,idx) =>
            btn.addEventListener("click", () => {
                id=btn.dataset.id;
                console.log(btn.dataset.id);
                Swal.fire({
                    title: 'Delete this register?',
                    showDenyButton: true,
                    confirmButtonText: 'Yes',
                    denyButtonText: `No`,
                }).then(async(result) => {
                    try {
                        if (result.isConfirmed) {
                            await deleteDoc(doc(db, "prendas", id));
                            Swal.fire("Register Delete");
                        }                         
                    } catch (error) {
                        Swal.fire("ERROR DELETE FILED");
                    }
                })       
            })
        );

        const btnEdit = document.querySelectorAll(".btnEdit");
        btnEdit.forEach((btn) => {
            btn.addEventListener("click", async (e) => {
                try {
                    id=btn.dataset.id;
                    console.log(id);
                    const data= await getDoc(doc(db, "prendas", id));
                    const prenda = data.data();
                    document.querySelector("#emod").value=prenda.mod;
                    document.querySelector("#etropa").value=prenda.tropa;
                    document.querySelector("#eprecio").value=prenda.precio;
                    document.querySelector("#ecolor").value=prenda.color;
                    editStatus = true;
                    id = data.id;
                } catch (error) {
                    console.log(error);
                }
            });
        });

    });
    
});

const btnAdd=document.querySelector("#btnAdd");
btnAdd.addEventListener("click",()=>{
    const mod=document.querySelector("#mod").value;
    const tropa=document.querySelector("#tropa").value;
    const precio=document.querySelector("#precio").value;
    const color=document.querySelector("#color").value;

    if(mod=="" || tropa=="" || precio=="" || color==""){
        Swal.fire("falta llenar Campos");
        return;
    }

    const prenda={ mod, tropa, precio, color};

    if (!editStatus) {
        addDoc(coleccion, prenda);        
        bootstrap.Modal.getInstance(document.getElementById('addModal')).hide();
    } 

    Swal.fire({
        icon: 'success',
        title: 'EXITO',
        text: 'Se guardo correctamente!'
    })
    document.querySelector("#formAddMod").reset();
});


const btnSave=document.querySelector("#btnSave");
btnSave.addEventListener("click",()=>{
    const mod=document.querySelector("#emod").value;
    const tropa=document.querySelector("#etropa").value;
    const precio=document.querySelector("#eprecio").value;
    const color=document.querySelector("#ecolor").value;

    if(mod=="" || tropa=="" || precio=="" || color==""){
        Swal.fire("Llena todos los campos");
        return;
    }

    const prenda={ mod, tropa, precio, color};

    if (editStatus) {
        updateDoc(doc(db, "prendas", id), prenda);
        editStatus = false;
        id = "";
        bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
    }

    Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Se han guardado los cambios'
    })
    document.querySelector("#formEdit").reset();
});