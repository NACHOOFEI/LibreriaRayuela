import React from "react";

export default function AboutUs() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 px-6 lg:px-20 mt-16 rounded-2xl shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div className="lg:w-1/2">
          <h2 className="text-4xl font-extrabold text-white mb-6 text-shadow-lg">
            Conocé más sobre nosotros
          </h2>
            <p className="text-lg text-white leading-relaxed mb-4">
            En <span className="font-semibold text-white">Librería Rayuela </span> 
            creemos en el poder transformador de los libros. Desde nuestros 
            comienzos, nos hemos dedicado a ofrecer una amplia selección de 
            títulos de calidad para lectores de todas las edades y gustos.
            <br /><br />
            Además de nuestra tienda virtual, contamos con un espacio físico 
            donde los amantes de la lectura pueden disfrutar de un ambiente 
            cálido, descubrir nuevas obras y compartir su pasión por los libros.
          </p>
        </div>

        <div className="lg:w-1/2">
          <img
            src="/local-libreria-rayuela.png"
            alt="Foto de la librería"
            className="w-full h-auto rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>
    </section>
  );
}
