require "date"
class Api::V1::RemindersController < ApplicationController
  def create
    category = current_user.reminder_categories.find(reminders_params[:category_id])
    seq = Reminder.reminder_next_sequence(category)

    reminder = Reminder.create(reminder: reminders_params[:reminder], sequence: seq, reminder_category: category)
    render json: reminder
  end

  def update
    reminder = Reminder.find(update_params[:id])
    if update_params[:reminder]
      reminder.reminder = update_params[:reminder]
    elsif update_params[:completed] == !!update_params[:completed]
      reminder.completed = update_params[:completed]
    elsif update_params[:date]
      reminder.time_due = DateTime.parse(update_params[:date])
    end

    reminder.save!

    render json: reminder
  end

  def destroy
    reminder = Reminder.find(delete_params[:id])
    category = reminder.reminder_category
    reminder.destroy

    reminders = category.reminders
    render json: reminders
  end

  def today
    tomorrow = DateTime.now().beginning_of_day + 1.day
    reminders = current_user.reminders.where(completed: false).where("time_due < ?", tomorrow).order("time_due DESC")
    render json: reminders
  end

  private

  def reminders_params
    params.permit(:category_id, :reminder)
  end

  def update_params
    params.permit(:id, :reminder, :date, :completed)
  end

  def delete_params
    params.permit(:id)
  end
end
