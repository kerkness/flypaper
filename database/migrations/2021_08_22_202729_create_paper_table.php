<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePaperTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('papers', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->unsignedInteger('user_id');
            $table->string('filename', 255)->nullable();
            $table->string('source', 255)->nullable();
            $table->string('mime_type', 50)->nullable();
            $table->integer('width')->nullable();
            $table->integer('height')->nullable();
            $table->integer('size')->nullable();
            $table->string('category', 50)->nullable();
            $table->tinyInteger('approved')->default(0);
            $table->tinyInteger('featured')->default(0);
        });

        Schema::create('tags', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('slug', 255)->unique();
            $table->string('label', 255)->nullable();
        });

        Schema::create('paper_tag', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('paper_id');
            $table->unsignedInteger('tag_id');
            $table->index(['paper_id', 'tag_id']);
        });

        Schema::create('paper_likes', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('paper_id');
            $table->unsignedInteger('user_id');
            $table->index(['paper_id', 'user_id']);
        });

        Schema::create('paper_downloads', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('paper_id');
            $table->unsignedInteger('user_id');
            $table->index(['paper_id', 'user_id']);
        });

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('papers');
        Schema::dropIfExists('tags');
        Schema::dropIfExists('paper_tag');
        Schema::dropIfExists('paper_downloads');
        Schema::dropIfExists('paper_likes');

    }
}
