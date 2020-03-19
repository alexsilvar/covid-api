require('dotenv').config();
const app = require('express')();
const cors = require('cors');
const axios = require('axios').default;
const cheerio = require('cheerio');

const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const url = process.env.MONGODB_URI;
mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true });
const GENERAL_ID = "5e72cd82b4938500476b1945";

const generalData = mongoose.model('general', new mongoose.Schema({ _id: String, cases: Number, deaths: Number, recovered: Number, updated: Date }));


const getAll = () => {
    return axios.get('https://www.worldometers.info/coronavirus/')
        .then((page) => {
            // to store parsed data
            const result = {};

            // get HTML and parse death rates
            const html = cheerio.load(page.data);
            // console.log(page.data);
            html(".maincounter-number").filter((i, el) => {
                let count = el.children[0].next.children[0].data || "0";
                count = parseInt(count.replace(/,/g, "") || "0", 10);
                // first one is
                if (i === 0) {
                    result.cases = count;
                } else if (i === 1) {
                    result.deaths = count;
                } else {
                    result.recovered = count;
                }
            });
            result.updated = Date.now();
            return result;
        });
};

const getCountries = () => {

};

app.get('/', (req, res) => {
    res.send('working awesome');
});

app.get('/all', (req, res) => {
    generalData.findById(GENERAL_ID, (err, doc) => {
        if (doc) {
            console.log(doc);
            let jsonResp = { cases: doc.cases, deaths: doc.deaths, recovered: doc.recovered, updated: doc.updated };
            res.status(200).send(jsonResp);
        } else {
            getAll()
                .then(result => { res.status(200).send(result); })
                .catch(err => { res.status(500).send(err); });
        }
    }).then(() => {
        getAll()
            .then(result => {
                generalData.findOneAndUpdate({ _id: GENERAL_ID }, result, { upsert: true }, (err, doc) => {
                    if (err) console.log('err update', err);
                    else console.log('doc' + doc);
                });
            });
    });
});


app.use(cors());

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening to ${port}`);
})