import {replaceMarkdownHeadingAfterUuidWithNewHeading} from "../moveFountainHeadingsToTodos"

describe("Replacing heading in markdown document with new heading", () => {
    it("Adds new heading if no heading was yet present", () => {
        const uuid = "07532be5-5d07-4d11-ad12-7c11f3c06792"
        const newHeading = "A random new heading up in here!"
        const fullTodoContentBefore = `
# 2-1
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd

<!-- 07532be5-5d07-4d11-ad12-7c11f3c06792 -->
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd

<!-- 07532be5-5d07-4d11-ad12-7c11f3c06792 -->
# 2-5
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd

# 2-6
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd
        `

        const fullTodoContentAfter = `
# 2-1
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd

<!-- 07532be5-5d07-4d11-ad12-7c11f3c06792 -->
# ${newHeading}
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd

<!-- 07532be5-5d07-4d11-ad12-7c11f3c06792 -->
# 2-5
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd

# 2-6
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd
        `

        const newTodoContent = replaceMarkdownHeadingAfterUuidWithNewHeading(
            fullTodoContentBefore,
            uuid,
            newHeading
        )

        expect(newTodoContent).toEqual(fullTodoContentAfter)
    })

    it("Replaces previous heading if heading was already present", () => {
        const uuid = "07532be5-5d07-4d11-ad12-7c11f3c06792"
        const newHeading = "A random new heading up in here!"
        const fullTodoContentBefore = `
# 2-1
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd

<!-- 07532be5-5d07-4d11-ad12-7c11f3c06792 -->
# 2-4
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd

<!-- 07532be5-5d07-4d11-ad12-7c11f3c06792 -->
# 2-5
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd

# 2-6
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd
        `

        const fullTodoContentAfter = `
# 2-1
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd

<!-- 07532be5-5d07-4d11-ad12-7c11f3c06792 -->
# ${newHeading}
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd

<!-- 07532be5-5d07-4d11-ad12-7c11f3c06792 -->
# 2-5
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd

# 2-6
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd
        `

        const newTodoContent = replaceMarkdownHeadingAfterUuidWithNewHeading(
            fullTodoContentBefore,
            uuid,
            newHeading
        )

        expect(newTodoContent).toEqual(fullTodoContentAfter)
    })
})
