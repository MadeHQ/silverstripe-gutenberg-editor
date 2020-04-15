Editor
    - (exports - public)
        - getData() - // These will be on the instance NOT the Object
        - setData() - // These will be on the instance NOT the Object
        - render(htmlNode, {
            blocks: []
            blockOrder: []
            onChange: () => {}
          })
        - BlockTypeInjector
            - addBlockType(Component)
            - removeBlockType(Component.Id)
            - getBlockByType(Component.Id) // returns Component
            - listBlockTypes() // returns [...Component]
        - BlockManagement
            - addBlock(data, beforeBlock)
            - removeBlock(id)
            - getBlock(id)
            - getBlockOrder()
            - moveBlockUp(id)
            - moveBlockDown(id)
