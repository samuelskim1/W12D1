# json.array! @teas, :id, :flavor, :price, :description

# you can see the change in localhost:5000

@teas.each do |tea_ele|
    json.set! tea_ele.id do 
        #the assignment of keys
        # json.id tea.id
        # json.flavor tea.flavor
        # json.price tea.price
        # json.description tea.description

        #instead of doing that, we can use json.extract!
        #json.extract! tea, :id, :flavor, :price, :description

        #can utilize the extract method in through partials

        json.partial! '/api/teas/tea', tea: tea_ele
        #the first tea is the partial file name
        # the key tea is referencing the variable name in the partial
        # the key tea_ele value is referencing what's passed in the block argument of do
    end
end

# {
    #   1:
    #   2:
    #   3: 
    #   4:
#}
