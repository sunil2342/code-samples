'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const asyncForEach = require("../utils/asyncForEach")

module.exports = {
    createOrUpdate: async (ctx) => {
        try {
            if(!ctx.request.body.deviceType) {
                return {
                    success: false,
                    message: "Missing or Invalid deviceType! Expected 'devices' or 'ios'"
                }
            }

            let device = await strapi.query("devices").findOne({ deviceId: ctx.params.deviceId })

            if(ctx.request.body.released) {
                ctx.request.body.released = new Date(ctx.request.body.released).toISOString()
            } 

            if(ctx.request.body.updated) {
                ctx.request.body.updated = new Date(ctx.request.body.updated).toISOString()
            }

            delete ctx.request.body.deviceId

            if(ctx.request.body.developerEmail) {
                let developer = await strapi.query("developer").findOne({ email: ctx.request.body.developerEmail })
                if(!developer) {
                    developer = await strapi.query("developer").create({ 
                        email: ctx.request.body.developerEmail, 
                        name: ctx.request.body.developer,
                        website: ctx.request.body.developerWebsite,
                        address: ctx.request.body.developerAddress,
                        internalId: ctx.request.body.developerInternalID
                    })
                }
                ctx.request.body.developer = developer.id
            } else {
                return {
                    success: false,
                    message: "Developer email not found!"
                }
            }

            let stats

            if(!device) {
                device = await strapi.query("devices").create({ deviceId: ctx.params.deviceId, ...ctx.request.body })
                stats = await strapi.query("stats").create({
                    device: device.id,
                    ...ctx.request.body
                })
            } else {
                device = await strapi.query("devices").update({ deviceId: ctx.params.deviceId }, ctx.request.body)
                stats = await strapi.query("stats").update({ id: device.stats.id }, ctx.request.body)
            }

            delete stats.device

            return {
                success: true,
                device: {
                    ...device,
                    stats
                }
            }
        } catch(e) {
            return {
                success: false,
                error: e
            }
        } 
    },
    createOrUpdateMultiple: async (ctx) => {
        try {
            if(!Array.isArray(ctx.request.body)) {
                return {
                    success: false,
                    message: "Please provide array of devices!"
                }
            }
            
            const updatedArray = []
            let unsuccessful = []

            await asyncForEach(ctx.request.body, async (data, index) => {
                if(!data.deviceType) {
                    return unsuccessful.push({
                        index,
                        message: "Missing or Invalid deviceType! Expected 'android' or 'ios'"
                    })
                }

                let device = await strapi.query("devices").findOne({ deviceId: data.deviceId })

                if(data.released) {
                    data.released = new Date(data.released).toISOString()
                } 

                if(data.updated) {
                    data.updated = new Date(data.updated).toISOString()
                }

                if(data.developerEmail) {
                    let developer = await strapi.query("developer").findOne({ email: data.developerEmail })
                    if(!developer) {
                        developer = await strapi.query("developer").create({ 
                            email: data.developerEmail, 
                            name: data.developer,
                            website: data.developerWebsite,
                            address: data.developerAddress,
                            internalId: data.developerInternalID
                        })
                    }
    
                    data.developer = developer
                } else {
                    return unsuccessful.push({
                        index,
                        message: "Developer email not found!"
                    })
                }
                
                let stats

                if(!device) {
                    device = await strapi.query("devices").create(data)
                    stats = await strapi.query("stats").create({
                        device: device.id,
                        ...data
                    })
                } else {
                    device = await strapi.query("devices").update({ deviceId: data.deviceId }, data)
                    stats = await strapi.query("stats").update({ id: device.stats.id }, data)
                }

                delete stats.device

                updatedArray.push({ ...device, stats })
            })

            return {
                success: true,
                devices: updatedArray,
                unsuccessful
            }
        } catch(e) {
            return {
                success: false,
                error: e
            }
        }
    },
    find: async (ctx) => {
        try {
            const { deviceId, developer } = ctx.query
            const query = deviceId ? { deviceId } : ( developer ? { developer } : null )

            if(!query) {
                return {
                    success: false,
                    message: "Expected Query not found!"
                }
            }
            const method = deviceId ? "findOne" : "find"

            let device = await strapi.query("devices")[method](query)

            if(!device || device.length <= 0) {
                return {
                    success: false,
                    message: "devices not found!"
                }
            }

            return {
                success: true,
                device
            }
        } catch (e) {
            return {
                success: false,
                error: e
            }
        } 
    },

    delete: async (ctx) => {
        try {
            const { deviceId, developer } = ctx.query
            const query = deviceId ? { deviceId } : ( developer ? { developer } : null )

            if(!query) {
                return {
                    success: false,
                    message: "Expected Query not found!"
                }
            }

            let devices = await strapi.query("devices").delete(query)
            return {
                success: true,
                devices
            }
        } catch (e) {
            return {
                success: false,
                error: e
            }
        }
    }
};
