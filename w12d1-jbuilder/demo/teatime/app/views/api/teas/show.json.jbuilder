
json.tea do
    json.partial! 'tea', tea: @tea
    json.transactionIds @tea.transaction_ids
end

# transactions = @tea.transactions.includes(:user)

json.transactions do 
    @transactions.each do |transaction|
        json.set! transaction.id do
            json.extract! transaction, :id, :quantity
            json.customer transaction.user.username;
            #normally not good practice but was done for the sake of the demonstartion
        end
    end
end
