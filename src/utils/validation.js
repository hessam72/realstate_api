// validate update items
const ValidateUpdateFields = (updates, allowUpdates) => {
    const isValidOperation = updates.every((update) => allowUpdates.includes(update))
    if (!isValidOperation) {
        return false
    }
    return true
}


module.exports = {
    ValidateUpdateFields
}