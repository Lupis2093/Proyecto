import {app} from './firebase.js'

import { getAuth,createUserWithEmailAndPassword,GoogleAuthProvider,signInWithEmailAndPassword,onAuthStateChanged,signInWithPhoneNumber,signInWithPopup,signInAnonymously,signOut,RecaptchaVerifier
    } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";


   

let user=null;
const auth = getAuth(app);

onAuthStateChanged(auth,(user)=>{

  const container=document.querySelector("#container");
  checarEstado(user);
  if(user){
    container.innerHTML=`
    <p> ${user.email}</p>
    <p> ${user.phoneNumber}</p>
    
    <button class="btn btn-outline-success" id="btnAdd" data-bs-toggle="modal" data-bs-target="#addModal"><i class="bi bi-box-arrow-up m-2"></i>Nueva prenda</button>
      <table class="table">
        <thead class="table table-danger table-hover">
          <tr>
            <th scope="col">Modelo</th>
            <th scope="col">Tipo de Ropa</th>
            <th scope="col">Precio</th>
            <th scope="col">Color</th>
            <th scope="col">Editar</th>
            <th scope="col">Codigo QR</th>
            <th scope="col">Eliminar</th>
          </tr>
        </thead>
        <tbody id="lista">
        </tbody>
      </table>
    `
    const uid=user.uid;
  }else{
    container.innerHTML=`<h1>Inicie Sesión para Continuar</h1>`
  }

})

const btnFon=document.querySelector("#BtnPhone");
btnFon.addEventListener('click', async(e)=>{
  e.preventDefault();
  try{
    const {value:tel}=await Swal.fire({
      title: 'Ingrese Su numero Telefonico',
      input: 'tel',
      inputLabel: 'Telefono',
      inputValue: '+525569696969',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Enviar Codigo',
      showCancelButton: true,
    })
    window.recaptchaVerifier=new RecaptchaVerifier('recaptcha', {'size':'invisible'}, auth);
    const appVerifier=window.recaptchaVerifier;
    const confirmationResult=await signInWithPhoneNumber(auth, tel, appVerifier)
    console.log(confirmationResult);
    window.confirmationResult=confirmationResult;
    const {value:code}=await Swal.fire({
      title: 'Ingrese el codigo',
      input: 'text',
      inputLabel: 'Codigo',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Iniciar',
      showCancelButton: true,
    })

    const result=await window.confirmationResult.confirm(code)
    user=result.user;
    checarEstado(user)

  }catch(error){
    Swal.fire('No fue posible iniciar sesión, intente mas tarde...');
  }
  });


const btnAn=document.querySelector("#BtnAn");
btnAn.addEventListener('click', async(e)=>{
e.preventDefault();
    try {
        const result=await signInAnonymously(auth);
        user=result.user;
        bootstrap.Modal.getInstance(document.getElementById('modLog')).hide();
    } catch (error) {
        console.log(error)
        Swal.fire({
            icon: 'error',
           title: 'Error...!',
            text: 'No fue posible iniciar sesión, intente mas tarde...',
              })
    }

});





const btnGoogle=document.querySelector("#BtnCAG");
btnGoogle.addEventListener('click', async(e)=>{
e.preventDefault();
  const provider = new GoogleAuthProvider();
    try {
        const credencial=await signInWithPopup(auth, provider)
        user=credencial.user;
        checarEstado(user);
        console.log(credencial)
        Swal.fire({
            icon: 'success',
        title: 'Exito!',
        text: 'Ah iniciado sesion',
        
    })
    } catch (error) {
        console.log(error)
        Swal.fire({
            icon: 'error',
           title: 'Error...!',
            text: 'No fue posible iniciar sesión, intente mas tarde...',
              })
    }

});

const checarEstado=(user=null)=>{
  console.log(user);
  if(user==null){
    document.querySelector("#iniciar").style.display="block";
    document.querySelector("#crear").style.display="block";
    document.querySelector("#BtnCAG").style.display="block";
    document.querySelector("#BtnPhone").style.display="block";
    document.querySelector("#cerrar").style.display="none";
  }
  else{
    document.querySelector("#iniciar").style.display="none";
    document.querySelector("#crear").style.display="none";
    document.querySelector("#BtnCAG").style.display="none";
    document.querySelector("#BtnPhone").style.display="none";
    document.querySelector("#cerrar").style.display="block";
  }
}



const btClose=document.querySelector("#cerrar");
btClose.addEventListener('click', async(e)=>{
  e.preventDefault();
  try{
    await signOut(auth)
    checarEstado()
  }catch(error){
    console.log(error)
  }
});


const btnIniciar=document.querySelector("#BtnI");
btnIniciar.addEventListener('click', async(e)=>{
e.preventDefault();
const email=document.querySelector("#Iemail");
const password=document.querySelector("#IPass");
console.log(email.value,password.value);
try {
    const res=await signInWithEmailAndPassword(auth, email. value, password.value)
    console.log(res);
    Swal.fire({
        icon: 'success',
    title: 'Exito!',
    text: 'Ah iniciado sesion',
     })
    var myModalEl = document.getElementById ('modLog');
        var modal=bootstrap.Modal.getInstance(myModalEl)
        modal.hide();
    const resII= await onAuthStateChanged (auth, (user)=>{
        const container=document.querySelector("#container");
        const Bbody=document.querySelector("#Bbody");
        if(user){
            container.innerHTML=`<h1>${user.email}</h1>`
            document.querySelector("#iniciar").style.display="none";
            document.querySelector("#crear").style.display="none";
            const uid=user.uid;
        }else{
container.innerHTML=`<h1>No existe el usuario</h1>`
        }

          })
} catch (error) {
    Swal.fire({
        icon: 'error',
       title: 'Error...!',
        text: 'La contraseña o correo es incorrecto',
          })
}

});

const btncrearcuenta=document.querySelector("#btncrear")

btncrearcuenta.addEventListener('click', async(e)=>{
    e.preventDefault();
const email=document.querySelector("#crearemail");
const password=document.querySelector("#crearcontra");
console.log(email.value,password.value);
var myModalEl=document.getElementById('crearModal');
var modal=bootstrap.Modal.getInstance(myModalEl)

try{
    const respuesta=await createUserWithEmailAndPassword (auth, email.value, password.value)
console.log(respuesta.user);
Swal.fire({
    icon: 'success',
    title: 'Exito...!',
    text: 'Tu cuenta a sido creada exitosamente!',
  })
  email.value='';
  password.value=''
  modal.hide();
}catch (error){
console.log(error.code);
const code=error.code;
if (code=='auth/invalid-email'){
    Swal.fire({
        icon: 'error',
        text: 'Correo Invalido',
          })
}
if (code=='auth/weak-password'){
    Swal.fire({
        icon: 'error',
        text: 'Contraseña Invalida',
          })
}
if (code=='auth/email-already-in-user'){
    Swal.fire({
        icon: 'error',
        text: 'Este correo ya esta en uso',
          })
}
}

});