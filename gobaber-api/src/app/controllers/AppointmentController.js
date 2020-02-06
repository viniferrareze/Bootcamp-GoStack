import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore } from 'date-fns';
import User from '../models/User';
import Appointment from '../models/Appointment';

class AppointmentController {
   async store(req, res) {
      const schema = Yup.object().shape({
         provider_id: Yup.number().required(),
         date: Yup.date().required(),
      });

      if (!(await schema.isValid(req.body))) {
         return res.status(400).json({ error: 'Validation fails' });
      }

      const { provider_id, date } = req.body;

      // checa se existe o usuário e se o mesmo é um provider.
      const isProvider = await User.findOne({
         where: { id: provider_id, provider: true },
      });

      if (!isProvider) {
         return res
            .status(401)
            .json({ error: 'You can only create appointment with providers!' });
      }

      // pega somente a roda da data que foi informada
      const hourStart = startOfHour(parseISO(date));

      // valida se a data que informou já passou da data atual
      if (isBefore(hourStart, new Date())) {
         return res.status(400).json({ error: 'Past dates are not permitted' });
      }

      // checar se a data informada possui já uma agendamento.
      const checkAppointment = await Appointment.findOne({
         where: {
            provider_id,
            canceled_at: null,
            date: hourStart,
         },
      });

      // se possuir não pode ser agendado
      if (checkAppointment) {
         return res
            .status(400)
            .json({ error: 'Appoint date is not available' });
      }

      const appointment = await Appointment.create({
         user_id: req.userId,
         provider_id,
         date: hourStart,
      });

      return res.json(appointment);
   }
}

export default new AppointmentController();
