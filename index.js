const express = require("express")
const pool = require("./db/config")

const app = express()
const reportarConsulta = (req, res, next) => {
    console.log(`Consulta: ${req.method} ${req.originalUrl}`)
    next()
}


app.get("/", reportarConsulta, async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()")
        res.send("Servidor conectado correctamente a PostgreSQL")
    } catch (error) {
        console.error(error)
        res.status(500).send("Error al conectar con PostgreSQL")
    }
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`)
})

app.get("/joyas", reportarConsulta, async (req, res) => {
    try {
        const {
            limits = 6,
            page = 1,
            order_by = "id_ASC"
        } = req.query

        const offset = (page - 1) * limits

        const [campo, direccion] = order_by.split("_")

        const camposPermitidos = [
            "id",
            "nombre",
            "categoria",
            "metal",
            "precio",
            "stock"
        ]

        const direccionesPermitidas = ["ASC", "DESC"]

        if (
            !camposPermitidos.includes(campo) ||
            !direccionesPermitidas.includes(direccion)
        ) {
            return res.status(400).send("Ordenamiento no válido")
        }

        const totalResult = await pool.query(
            "SELECT COUNT(*) FROM inventario"
        )

        const totalJoyas = Number(totalResult.rows[0].count)

        const totalPaginas = Math.ceil(totalJoyas / limits)

        const result = await pool.query(
            `SELECT * FROM inventario
             ORDER BY ${campo} ${direccion}
             LIMIT $1 OFFSET $2`,
            [limits, offset]
        )

        const joyas = result.rows.map((joya) => ({
            ...joya,
            links: {
                self: `/joyas/${joya.id}`
            }
        }))

        const links = {
            self: `/joyas?limits=${limits}&page=${page}&order_by=${order_by}`
        }

        if (page < totalPaginas) {
            links.next = `/joyas?limits=${limits}&page=${Number(page) + 1}&order_by=${order_by}`
        }

        if (page > 1) {
            links.prev = `/joyas?limits=${limits}&page=${Number(page) - 1}&order_by=${order_by}`
        }

        res.json({
            total: totalJoyas,
            page: Number(page),
            limits: Number(limits),
            totalPages: totalPaginas,
            results: joyas,
            links
        })

    } catch (error) {
        console.error(error)
        res.status(500).send("Error al obtener las joyas")
    }
})

app.get("/joyas/filtros", reportarConsulta, async (req, res) => {
    try {
        const { precio_min, precio_max, categoria, metal } = req.query

        let filtros = []
        let valores = []
        let contador = 1

        if (precio_min) {
            filtros.push(`precio >= $${contador}`)
            valores.push(precio_min)
            contador++
        }

        if (precio_max) {
            filtros.push(`precio <= $${contador}`)
            valores.push(precio_max)
            contador++
        }

        if (categoria) {
            filtros.push(`categoria = $${contador}`)
            valores.push(categoria)
            contador++
        }

        if (metal) {
            filtros.push(`metal = $${contador}`)
            valores.push(metal)
            contador++
        }

        let query = "SELECT * FROM inventario"

        if (filtros.length > 0) {
            query += " WHERE " + filtros.join(" AND ")
        }

        const result = await pool.query(query, valores)

        res.json(result.rows)

    } catch (error) {
        console.error(error)
        res.status(500).send("Error al filtrar las joyas")
    }
})

app.get("/joyas/:id", reportarConsulta, async (req, res) => {
    try {
        const { id } = req.params

        const result = await pool.query(
            "SELECT * FROM inventario WHERE id = $1",
            [id]
        )

        res.json(result.rows)
    } catch (error) {
        console.error(error)
        res.status(500).send("Error al obtener la joya")
    }
})

