const { rescuer } = require('../utils/instances');
const {HandlerHttpVerbs} = require("../errors/handlerHttpVerbs");

exports.setRescuer = async (req, res) => {
    try {
        const response_body = await rescuer.setRescuer(req.body);

        res.status(201).json(
            HandlerHttpVerbs.created(
                "Added rescuer ✅", {
                    data: response_body,
                    url: req.baseUrl,
                    verb: req.method
                }
            )
        );

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, {url: req.baseUrl, verb: req.method}
            )
        );
    }
};

exports.getRescuer = async (req, res) => {
    try {
        res.status(200).json(await rescuer.getRescuer(req.id));

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, {url: req.baseUrl, verb: req.method}
            )
        );
    }
}

exports.deleteRescuer = async (req, res) => {
    try {
        await rescuer.deleteRescuer(req.id);
        res.status(204).end();

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, {url: req.baseUrl, verb: req.method}
            )
        );
    }
}

exports.updateRescuer = async (req, res) => {
    try {
        const response_body = await rescuer.updateRescuer(req.id, req.body);

        res.status(202).json(
            HandlerHttpVerbs.accepted(
                "Updated rescuer ✅", {
                    data: response_body,
                    url: req.baseUrl,
                    verb: req.method
                }
            )
        );

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, {url: req.baseUrl, verb: req.method}
            )
        );
    }
}