const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

function read(reviewId) {
    return knex("reviews")
        .select("*")
        .where({ review_id: reviewId })
        .first();
}

function destroy(reviewId) {
    return knex("reviews")
        .where({ review_id: reviewId })
        .del();
}

function update(review) {
    return knex("reviews as r")
        .join("critics as c", "r.critic_id", "c.critic_id")
        .select("*")
        .where({ review_id: review.review_id })
        .update(review, "*");
}

function updateReviewRecord(reviewId) {
    return knex("reviews as r")
        .join("critics as c", "r.critic_id", "c.critic_id")
        .select("*")
        .where({ review_id: reviewId })
        .first()
        .then((criticReview) => {
            const critic = mapProperties({
                preferred_name: "critic.preferred_name",
                surname: "critic.surname",
                organization_name: "critic.organization_name",
            });
            return critic(criticReview);
        })
        .then((updatedCritic) => {
            const reviewRecord = {
                ...updatedCritic,
                created_at: new Date(),
                updated_at: new Date(),
            }
            return reviewRecord;
        })
}

module.exports = {
    read,
    destroy,
    update,
    updateReviewRecord,
}