<?php 

foreach($_POST as $k=>$v){ 
$$k=$v; 
} 

if (!ini_get('register_globals')) { 
   $superglobales = array($_SERVER, $_ENV, 
       $_FILES, $_COOKIE, $_POST, $_GET); 
   if (isset($_SESSION)) { 
       array_unshift($superglobales, $_SESSION); 
   } 
   foreach ($superglobales as $superglobal) { 
       extract($superglobal, EXTR_SKIP); 
   } 
} 

?>

<?
$mail="davakvdesigner@gmail.com";//dirección de correo electrónico donde llegarán los datos del formulario.
$origen='jorgeconj.com';//Nombre del que envía el formulario. Lo toma del mismo formulario. Aparecerá dentro de nuestra aplicación de correo.
$correo_from=$mail;//Dato del correo de quien envía el formulario. Lo toma del mismo formulario. También aparecerá en la aplicación de correo.
$subject="Contacto desde el sitio de tu Portafolio";//El título del correo enviado. 

$myname="$nombre";

//Lo que se escriba en la variable "contenido" aparecerá dentro del mensaje del correo. Para darle formato pueden utilizarse etiquetas HTML.
//Adaptar el nombre de las variables dependiendo del tipo de información usado en nuestro formulario.
$contenido="

<table style='width:600px; margin: 0 auto; border: 1px solid #000000;'>
<tr>
<td><img src='http://jorgeconj.com/assets/img/logo.png' style='width:100%; height: auto; margin: 0; padding: 0;background:#000000;'></td>
</tr>
<tr>
<td style='border-bottom: 1px solid #000000;'>
<h2 style='text-align: center;'>Mensaje desde el sitio JorgeconJ.com</h2>
</td>
</tr>
<tr>
<td>
<p style='font-size: 1.3em; text-align: center;'><span style='color: red;'>$nombre</span> mandó un mensaje desde el sitio de JorgeconJ.com<br>
Estos son los datos de contacto:</p>
<table cellpadding='0' cellspacing='0' style='width:300px; margin:0 auto;'>
<tr>
<td style='width:130px; padding:5px; '><strong>Nombre</strong></td>
<td style='width:130px; padding:5px; '>$nombre</td>
</tr>
<tr style='background: rgba(0,0,0,0.2)'>
<td style='width:130px; padding:5px; '><strong>Teléfono</strong></td>
<td style='width:130px; padding:5px; '>$telefono</td>
</tr>
<tr>
<td style='width:130px; padding:5px; '><strong>Mail</strong></td>
<td style='width:130px; padding:5px; '>$correo</td>
</tr>
<tr>
<td style='width:130px; padding:5px; '><strong>Asunto</strong></td>
<td style='width:130px; padding:5px; '>$asunto</td>
</tr>
<tr>
<td style='width:130px; padding:5px; '><strong>Proyecto</strong></td>
<td style='width:130px; padding:5px; '>$proyecto</td>
</tr>
</table>
</td>
</tr>
<tr>
<td style='border-top: 1px solid #000000;'>
<p style='font-size:11px; text-align: center; padding:5px; text-align: center;'>Este es un correo mandado desde el formulario de contacto desde el sitio de tu portafolio</p>
</td>
</tr>
</table>

";


$headers = "MIME-Version: 1.0 \r\n";
$headers .= "Content-type: text/html; charset=iso-8859-1\r\n";
$headers .= "From: \"".$origen."\" <$correo_from>\r\n";


mail($mail, "$subject", $contenido,$headers);
//mail($mail, "Contacto desde el sitio de Streamics Lab", $contenido,$headers);
?>
<script>
alert('¡Gracias por enviar tus comentarios!');
document.location.href="index.html";
</script>