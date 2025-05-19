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
                    <h2 className="text-lg font-medium mb-4">¿Qué es Ubara?</h2>
                    <p className="text-muted-foreground mb-4">
                      Ubara significa "abundancia" en el idioma Igbo, una etnia africana ubicada principalmente en Nigeria. Esta palabra representa una conexión con las raíces culturales, la belleza de lo hecho a mano y la riqueza que se transmite a través del arte. Hoy, Ubara canaliza esa energía en cuadros únicos, hechos a mano, que transforman espacios con intención, emoción y estilo.
                    </p>
                    <h2 className="text-lg font-medium mb-4 mt-8">Nuestra historia</h2>
                    <p className="text-muted-foreground mb-4">
                      Ubara nació como un hobbie, con la idea de transformar sentimientos, pensamientos y emociones en algo tangible. Las primeras creaciones fueron piezas de arcilla blanca, funcionales y decorativas, que buscaban mantener vivas las tradiciones artesanales e integrar piedras naturales con un propósito emocional.
                    </p>
                    <p className="text-muted-foreground">
                      Con el tiempo, el proyecto evolucionó hacia la creación de cuadros texturizados hechos a mano, combinando diseño, color y volumen. Hoy, Ubara sigue fiel a su esencia: conectar con las personas a través de obras únicas que transforman espacios y transmiten intención.
                    </p>
                  </div>
                  <div className="order-first md:order-last">
                    <Image
                      src="/images/nosotros.webp"
                      alt="Proceso de creación"
                      width={500}
                      height={400}
                      className="w-full h-auto object-cover"
                    />
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
                      En Ubara nos inspiramos en la naturaleza, y por eso trabajamos con materiales nobles, locales y procesos conscientes. Usamos embalajes reciclables y buscamos minimizar al máximo los residuos. Creemos que crear con respeto es también una forma de arte.
                    </p>
                    <h3 className="text-sm font-medium mb-2">Artesanía</h3>
                    <p className="text-sm text-muted-foreground">
                      Cada cuadro es hecho a mano, uno a uno. Valoramos las técnicas manuales y la belleza de lo imperfecto. Lo que ves en cada pieza es el reflejo del tiempo, la calma y la dedicación invertidos en su creación.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">Comunidad</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Ubara nace del deseo de conectar. Colaboramos con otros emprendimientos, apoyamos lo local y participamos en redes creativas. Creemos que el arte puede ser un puente entre personas y que los espacios compartidos también se construyen con belleza.
                    </p>
                    <h3 className="text-sm font-medium mb-2">Calidad</h3>
                    <p className="text-sm text-muted-foreground">
                      Cuidamos cada detalle. Usamos materiales resistentes y técnicas que garantizan durabilidad, sin perder lo esencial: que cada obra transmita intención, emoción y presencia.
                    </p>
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
                      Todo parte con una idea. Pensamos en formas, colores y emociones que queremos transmitir. Hacemos un boceto y elegimos una inspiración.
                    </p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <span className="text-xl font-light">02</span>
                    </div>
                    <h3 className="text-sm font-medium mb-2">Textura</h3>
                    <p className="text-sm text-muted-foreground">
                      Usamos una base de madera y aplicamos textura a mano para crear volumen y profundidad. Cada trazo es único, con relieves que reflejan la belleza de la imperfección.
                    </p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <span className="text-xl font-light">03</span>
                    </div>
                    <h3 className="text-sm font-medium mb-2">Color y terminación</h3>
                    <p className="text-sm text-muted-foreground">
                      Cuando la textura está seca, pintamos con colores según lo acordado. Luego embalamos la obra y la dejamos lista para entregar.
                    </p>
                  </div>
                </div>
              </section>

              {/* Sección How it works */}
              <section className="mt-16">
                <h2 className="text-3xl font-light text-center mb-12 tracking-widest">CÓMO FUNCIONA</h2>
                <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-y-20 gap-x-8">
                  {/* Línea vertical izquierda */}
                  <div className="hidden md:block absolute left-[8%] top-0 h-full w-0.5 bg-[#ede7de] z-0" style={{minHeight:'520px'}} />
                  {/* Línea vertical derecha */}
                  <div className="hidden md:block absolute left-[60%] top-0 h-[85%] w-0.5 bg-[#ede7de] z-0" style={{minHeight:'440px'}} />

                  {/* Columna izquierda */}
                  <div className="flex flex-col gap-24">
                    {/* Paso 1 */}
                    <div className="flex items-start gap-8 relative z-10">
                      <div className="w-28 h-28 flex items-center justify-center rounded-full bg-[#ede7de] text-4xl font-light text-gray-700 shrink-0">1</div>
                      <div className="text-left">
                        <h3 className="font-semibold mb-1 text-base">Conversamos</h3>
                        <p className="text-muted-foreground text-sm">Partimos con una conversación sobre el espacio que quieres intervenir. Hablamos de estilos, colores y emociones que deseas transmitir.</p>
                      </div>
                    </div>
                    {/* Paso 2 */}
                    <div className="flex items-start gap-8 relative z-10">
                      <div className="w-28 h-28 flex items-center justify-center rounded-full bg-[#ede7de] text-4xl font-light text-gray-700 shrink-0">2</div>
                      <div className="text-left">
                        <h3 className="font-semibold mb-1 text-base">Evaluamos el tamaño ideal</h3>
                        <p className="text-muted-foreground text-sm">Con fotos y medidas del lugar, te asesoro para definir el tamaño más armónico según las proporciones de tu muro.</p>
                      </div>
                    </div>
                    {/* Paso 3 */}
                    <div className="flex items-start gap-8 relative z-10">
                      <div className="w-28 h-28 flex items-center justify-center rounded-full bg-[#ede7de] text-4xl font-light text-gray-700 shrink-0">3</div>
                      <div className="text-left">
                        <h3 className="font-semibold mb-1 text-base">Definimos el diseño</h3>
                        <p className="text-muted-foreground text-sm">Escogemos juntas un referente o inspiración, pero es importante saber que el arte no se copia: se reinterpreta. Cada obra es única, hecha a mano, y por tanto nunca habrá dos cuadros iguales. Eso es parte de su magia</p>
                      </div>
                    </div>
                  </div>

                  {/* Columna derecha */}
                  <div className="flex flex-col gap-24">
                    {/* Paso 4 */}
                    <div className="flex items-start gap-8 relative z-10">
                      <div className="w-28 h-28 flex items-center justify-center rounded-full bg-[#ede7de] text-4xl font-light text-gray-700 shrink-0">4</div>
                      <div className="text-left">
                        <h3 className="font-semibold mb-1 text-base">Pago inicial y creación</h3>
                        <p className="text-muted-foreground text-sm">Con el 50% del valor, comenzamos la etapa de diseño y compra de materiales. El trabajo toma 10 días hábiles desde ese momento para estar listo.</p>
                      </div>
                    </div>
                    {/* Paso 5 */}
                    <div className="flex items-start gap-8 relative z-10">
                      <div className="w-28 h-28 flex items-center justify-center rounded-full bg-[#ede7de] text-4xl font-light text-gray-700 shrink-0">5</div>
                      <div className="text-left">
                        <h3 className="font-semibold mb-1 text-base">Entrega</h3>
                        <p className="text-muted-foreground text-sm">Puedes retirarlo o coordinar despacho a tu domicilio. También existe la posibilidad de instalación, que debe coordinarse directamente con la artista.</p>
                      </div>
                    </div>
                    {/* Paso 6 */}
                    <div className="flex items-start gap-8 relative z-10">
                      <div className="w-28 h-28 flex items-center justify-center rounded-full bg-[#ede7de] text-4xl font-light text-gray-700 shrink-0">6</div>
                      <div className="text-left">
                        <h3 className="font-semibold mb-1 text-base">A disfrutar</h3>
                        <p className="text-muted-foreground text-sm">Tu cuadro ya está listo para transformar tu espacio con arte único, hecho con intención y alma.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Sección de Equipo (ahora al final) */}
              <section className="mt-20">
                <h2 className="text-lg font-medium mb-6">Nuestro equipo</h2>
                <div className="flex justify-center">
                  <div className="text-center">
                    <div className="aspect-square relative mb-4 overflow-hidden w-40 h-40 mx-auto">
                      <Image
                        src="/images/equipo_cat.webp"
                        alt="Catalina"
                        fill
                        className="object-cover rounded-full"
                      />
                    </div>
                    <h3 className="text-sm font-medium">Catalina</h3>
                    <p className="text-sm text-muted-foreground">Fundadora & Diseñadora</p>
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
