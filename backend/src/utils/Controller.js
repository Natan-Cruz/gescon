import logger from "./logger"

export default function Controller(fn, res, _, status){
    fn()
    .then(response => res.status(status || 200).send(response))
    .catch( error => {
        console.log(error)
        logger.error(error)
        res.status(400).send({ name: error.name, message: error.message })
    })
}