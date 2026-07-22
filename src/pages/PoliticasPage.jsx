import { useNavigate } from "react-router-dom";

/**
 * Página de Políticas Comerciales — solo texto, accesible desde el header y el footer.
 * El contenido proviene del documento oficial de Tres Trigos.
 * NOTA: el horario entre semana se muestra como 4:00 p.m. (corte real de operación),
 * no 2:30 p.m. como decía una versión desactualizada del PDF.
 */
export default function PoliticasPage() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-1 text-sm font-medium text-brand-brown hover:text-brand-dark"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
          <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Volver
      </button>

      <h1 className="mb-8 text-2xl font-bold text-brand-dark sm:text-3xl">
        Políticas Comerciales de la Plataforma Institucional
      </h1>

      <div className="space-y-8 text-sm leading-relaxed text-brand-dark">
        <section>
          <h2 className="mb-2 text-base font-semibold text-brand-dark">
            1. Horario de recepción de pedidos
          </h2>
          <p className="mb-2">
            Los pedidos deberán realizarse a través de la Plataforma Institucional dentro de los
            siguientes horarios:
          </p>
          <ul className="ml-5 list-disc space-y-1 text-brand-brown">
            <li>Lunes a viernes: 7:30 a. m. – 4:00 p. m.</li>
            <li>Sábados: 7:30 a. m. – 11:00 a. m.</li>
            <li>Domingos y días festivos: No se reciben pedidos.</li>
          </ul>
          <p className="mt-2">
            Los pedidos ingresados fuera de estos horarios se entenderán como recibidos en el
            siguiente día hábil y su programación de entrega iniciará a partir de ese momento.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-brand-dark">2. Promesa de entrega</h2>
          <p className="mb-2">
            Nuestra promesa de entrega es de dos (2) días contados a partir de la recepción y
            confirmación del pedido dentro del horario establecido.
          </p>
          <p>
            Los tiempos de entrega podrán variar por causas de fuerza mayor, condiciones climáticas,
            novedades logísticas o situaciones ajenas a Tres Trigos. En estos casos, el cliente será
            informado oportunamente.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-brand-dark">3. Entregas en días festivos</h2>
          <p>
            Aunque los domingos y días festivos no son hábiles para la recepción de pedidos, Tres
            Trigos sí realiza entregas durante los días festivos, de acuerdo con la programación
            logística previamente establecida.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-brand-dark">4. Cobertura de distribución</h2>
          <p className="mb-3">
            Actualmente contamos con cobertura para despachos en las siguientes zonas:
          </p>

          <p className="mb-1 font-semibold text-brand-dark">Rutas Nacionales</p>
          <ul className="mb-4 ml-5 list-disc space-y-1 text-brand-brown">
            <li>Bogotá</li>
            <li>Barrancabermeja</li>
            <li>Bucaramanga</li>
            <li>Cali</li>
            <li>Cartagena</li>
            <li>Cartago</li>
            <li>Ibagué</li>
            <li>Manizales</li>
            <li>Pereira</li>
            <li>Santa Marta</li>
          </ul>

          <p className="mb-1 font-semibold text-brand-dark">Oriente Antioqueño</p>
          <ul className="ml-5 list-disc space-y-1 text-brand-brown">
            <li>Rionegro</li>
            <li>El Carmen de Viboral</li>
            <li>El Retiro</li>
            <li>Guarne</li>
            <li>La Ceja</li>
            <li>Llanogrande</li>
            <li>Marinilla</li>
            <li>San Antonio de Pereira</li>
            <li>Santa Elena</li>
            <li>Santuario</li>
          </ul>

          <p className="mt-3">
            La cobertura podrá ampliarse o modificarse según la capacidad logística de Tres Trigos.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-brand-dark">5. Confirmación de pedidos</h2>
          <p className="mb-2">
            Todos los pedidos realizados a través de la Plataforma Institucional estarán sujetos a
            validación por parte del equipo comercial y a la disponibilidad de inventario y capacidad
            de producción.
          </p>
          <p>La recepción del pedido no constituye su aceptación automática.</p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-brand-dark">6. Modificaciones y cancelaciones</h2>
          <p className="mb-2">
            Las modificaciones o cancelaciones deberán solicitarse antes del inicio del proceso de
            producción.
          </p>
          <p>
            Una vez el pedido haya sido programado o entre en producción, no será posible realizar
            cambios.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-brand-dark">7. Disponibilidad de productos</h2>
          <p className="mb-2">
            Todos los productos están sujetos a disponibilidad de inventario y capacidad de producción.
          </p>
          <p>
            En caso de presentarse alguna novedad, Tres Trigos informará oportunamente al cliente y
            propondrá una alternativa cuando sea posible.
          </p>
        </section>
      </div>
    </div>
  );
}