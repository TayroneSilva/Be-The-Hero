// conexão com Banco de Dados
const connection = require('../database/connection');

//modulo de exportação, abaixo temos a resposta do servidor para listar os incidentes:
module.exports = {
    async index(request, response){

        //paginação de numero total de casos;
        const { page = 1} = request.query;

        const [count] = await connection('incidents').count();
        console.log(count); 

        const incidents = await connection('incidents')
        .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
        .limit(5)
        .offset((page - 1)* 5)
        .select([
            'incidents.*',
            'ongs.name',
            'ongs.email',
            'ongs.whatsapp',
            'ongs.city',
            'ongs.uf'
        ]);

        response.header('X-Total-Count', count['count(*)']);

        return  response.json(incidents);
    },
// abaixo o código para anexar os dados no banco de dados
    async create(request, response){
        const { title, description, value} = request.body;
        const ong_id = request.headers.authorization;

        const [id] = await connection('incidents').insert({
            title,
            description,
            value,
            ong_id,
        });
// abaixo a resposta do servidor quando convluido a listagem dos incidentes:
        return response.json({id});
    },

    //código para deletar algum caso pelo id:
    async delete(request, response){

        const {id}= request.params;
        const ong_id = request.headers.authorization;

        const incident = await connection('incidents')
        .where('id', id)
        .select('ong_id')
        .first();

        if (incident.ong_id != ong_id){
            return response.status(401).json({error:'operation nor permitted'});
        }
        await connection('incidents').where('id', id).delete();
        return response.status(204).send();
    }
};