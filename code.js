class UltimateBlockCleaner {
    getInfo() {
        return {
            id: 'ultimateBlockCleaner',
            name: 'Чистильщик PRO',
            color1: '#8B4513',
            color2: '#A0522D',
            blocks: [
                {
                    opcode: 'removeHatlessBlocksOpcode',
                    blockType: Scratch.BlockType.BUTTON,
                    text: 'Удалить блоки без шапок',
                },
                {
                    opcode: 'removeEmptyHatsOpcode',
                    blockType: Scratch.BlockType.BUTTON,
                    text: 'Удалить пустые шапки',
                }
            ]
        };
    }

    removeHatlessBlocksOpcode() {
        if (!confirm('Вы уверены, что хотите удалить все скрипты, которые НЕ начинаются с "шапки"? Это действие нельзя отменить.')) {
            return;
        }

        const runtime = Scratch.vm.runtime;
        const targets = runtime.targets;
        let totalRemovedCount = 0;

        for (const target of targets) {
            while (true) {
                let blocksInThisPass = target.blocks.getScripts();
                let blockToDeleteId = null;

                for (const blockId of blocksInThisPass) {
                    const block = target.blocks.getBlock(blockId);
                    if (block && !runtime.getIsHat(block.opcode)) {
                        blockToDeleteId = blockId;
                        break;
                    }
                }

                if (blockToDeleteId) {
                    target.blocks.deleteBlock(blockToDeleteId);
                    totalRemovedCount++;
                } else {
                    break;
                }
            }
        }
        
        alert(`Очистка завершена! Удалено скриптов без шапок: ${totalRemovedCount}`);
    }

    removeEmptyHatsOpcode() {
        if (!confirm('Вы уверены, что хотите удалить все "шапки", к которым не присоединены другие блоки? Это действие нельзя отменить.')) {
            return;
        }

        const runtime = Scratch.vm.runtime;
        const targets = runtime.targets;
        let totalRemovedCount = 0;

        for (const target of targets) {
            const topLevelBlockIds = target.blocks.getScripts();

            for (const blockId of topLevelBlockIds) {
                const block = target.blocks.getBlock(blockId);
                if (!block) continue;

                const isHat = runtime.getIsHat(block.opcode);
                const isLonely = !block.next;

                if (isHat && isLonely) {
                    target.blocks.deleteBlock(blockId);
                    totalRemovedCount++;
                }
            }
        }

        alert(`Очистка завершена! Удалено пустых шапок: ${totalRemovedCount}`);
    }
}

Scratch.extensions.register(new UltimateBlockCleaner());
