const knex = require("../db/connection");

const mapProperties = require("../utils/map-properties");


function isShowing() {
    return knex("movies as m")
        .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
        .select("*")
        .where({ is_showing: true })
        .groupBy("m.movie_id");
}

function list() {
    return knex("movies").select("*");
}

function read(movieId) {
    return knex("movies")
        .select("*")
        .where({ movie_id: movieId })
        .first();
}

function readTheaters(movieId) {
    return knex("theaters as t")
        .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
        .select("*")
        .where({ movie_id: movieId, is_showing: true });
}

function readReviews(movieId) {
    return knex("reviews as r")
        .join("critics as c", "r.critic_id", "c.critic_id")
        .select("*")
        .where({ movie_id: movieId })
        .then((criticReviews) => {
            const reviewList = [];
            const critic = mapProperties({
                critic_id: "critic.critic_id",
                preferred_name: "critic.preferred_name",
                surname: "critic.surname",
                organization_name: "critic.organization_name",
            });
            
            criticReviews.forEach((review) => {
                const addCritic = critic(review);
                reviewList.push(addCritic);
            })
            return reviewList;
        });
        }

module.exports = {
    list, 
    isShowing,
    read,
    readReviews,
    readTheaters,
};