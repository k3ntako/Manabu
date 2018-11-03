class CreateNotes < ActiveRecord::Migration[5.2]
  def change
    create_table :notes do |t|
      t.string :name, null: false
      t.text :note, null: false

      t.timestamps null: false
    end
  end
end
