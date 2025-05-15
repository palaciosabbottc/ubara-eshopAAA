import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function NosotrosPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 pt-24 pb-12">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-medium mb-8">Nosotros</h1>

            <div className="space-y-12">
              {/* Sección de Historia */}
              <section>
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h2 className="text-lg font-medium mb-4">Nuestra historia</h2>
                    <p className="text-muted-foreground mb-4">
                      Ubara nació en 2018 como un pequeño taller de cerámica en Santiago. Lo que comenzó como un hobby,
                      se convirtió en una verdadera pasión por crear piezas únicas que reflejan la belleza de lo
                      imperfecto.
                    </p>
                    <p className="text-muted-foreground">
                      Cada pieza que creamos cuenta una historia, tiene su propio carácter y personalidad. Nos
                      inspiramos en la filosofía japonesa del wabi-sabi, que encuentra belleza en la imperfección y
                      acepta la transitoriedad de todas las cosas.
                    </p>
                  </div>
                  <div className="order-first md:order-last">
                    <Image
                      src="/images/crafting.png"
                      alt="Proceso de creación"
                      width={500}
                      height={400}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              </section>

              {/* Sección de Proceso */}
              <section>
                <h2 className="text-lg font-medium mb-4">Nuestro proceso</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <span className="text-xl font-light">01</span>
                    </div>
                    <h3 className="text-sm font-medium mb-2">Diseño</h3>
                    <p className="text-sm text-muted-foreground">
                      Cada pieza comienza con un boceto y una idea. Nos inspiramos en formas orgánicas y texturas
                      naturales.
                    </p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <span className="text-xl font-light">02</span>
                    </div>
                    <h3 className="text-sm font-medium mb-2">Modelado</h3>
                    <p className="text-sm text-muted-foreground">
                      Trabajamos la arcilla a mano, dando forma a cada pieza con cuidado y atención a los detalles.
                    </p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <span className="text-xl font-light">03</span>
                    </div>
                    <h3 className="text-sm font-medium mb-2">Acabado</h3>
                    <p className="text-sm text-muted-foreground">
                      Después de la cocción, aplicamos esmaltes naturales y realizamos una segunda cocción para lograr
                      el acabado final.
                    </p>
                  </div>
                </div>
              </section>

              {/* Sección de Valores */}
              <section>
                <h2 className="text-lg font-medium mb-4">Nuestros valores</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Sostenibilidad</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Utilizamos materiales locales y procesos respetuosos con el medio ambiente. Nuestros embalajes son
                      reciclables y minimizamos los residuos en nuestro taller.
                    </p>

                    <h3 className="text-sm font-medium mb-2">Artesanía</h3>
                    <p className="text-sm text-muted-foreground">
                      Valoramos el trabajo hecho a mano y las técnicas tradicionales. Cada pieza es única y refleja la
                      dedicación y el cuidado con el que fue creada.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">Comunidad</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Apoyamos a artesanos locales y participamos en iniciativas comunitarias. Creemos en el poder del
                      arte para conectar personas y crear comunidad.
                    </p>

                    <h3 className="text-sm font-medium mb-2">Calidad</h3>
                    <p className="text-sm text-muted-foreground">
                      Nos comprometemos con la excelencia en cada pieza que creamos. Utilizamos materiales de alta
                      calidad y técnicas cuidadosas para asegurar la durabilidad de nuestros productos.
                    </p>
                  </div>
                </div>
              </section>

              {/* Sección de Equipo */}
              <section>
                <h2 className="text-lg font-medium mb-6">Nuestro equipo</h2>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="aspect-square relative mb-4 overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=300&width=300&text=Carolina"
                        alt="Carolina"
                        fill
                        className="object-cover rounded-full"
                      />
                    </div>
                    <h3 className="text-sm font-medium">Carolina</h3>
                    <p className="text-sm text-muted-foreground">Fundadora & Ceramista</p>
                  </div>
                  <div className="text-center">
                    <div className="aspect-square relative mb-4 overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=300&width=300&text=Matías"
                        alt="Matías"
                        fill
                        className="object-cover rounded-full"
                      />
                    </div>
                    <h3 className="text-sm font-medium">Matías</h3>
                    <p className="text-sm text-muted-foreground">Diseñador & Ceramista</p>
                  </div>
                  <div className="text-center">
                    <div className="aspect-square relative mb-4 overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=300&width=300&text=Valentina"
                        alt="Valentina"
                        fill
                        className="object-cover rounded-full"
                      />
                    </div>
                    <h3 className="text-sm font-medium">Valentina</h3>
                    <p className="text-sm text-muted-foreground">Producción & Ventas</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
